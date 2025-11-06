"use client"

import { useEffect, useState, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { KanbanCard, KanbanColumn, KanbanSprint } from "@/types/kanban"
import { KanbanColumnComponent } from "./kanban-column"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"

interface KanbanBoardProps {
  initialColumns: KanbanColumn[]
  initialCards: KanbanCard[]
  initialSprints: KanbanSprint[]
  isAdmin: boolean
}

export function KanbanBoard({
  initialColumns,
  initialCards,
  initialSprints,
  isAdmin,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [cards, setCards] = useState(initialCards)
  const [sprints, setSprints] = useState(initialSprints)
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(
    initialSprints.find(s => s.is_active)?.id || initialSprints[0]?.id || null
  )
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isCreatingSprint, setIsCreatingSprint] = useState(false)
  const [newSprintName, setNewSprintName] = useState("")
  const [newSprintStartDate, setNewSprintStartDate] = useState("")
  const [newSprintEndDate, setNewSprintEndDate] = useState("")
  const [isEndingSprint, setIsEndingSprint] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // Only enable DnD on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Fetch fresh data from database
  const fetchCards = useCallback(async () => {
    try {
      let query = supabase.from("kanban_cards").select("*").order("position")

      // Filter by sprint if one is selected
      if (selectedSprintId) {
        query = query.eq("sprint_id", selectedSprintId)
      } else {
        // If no sprint selected, show cards without a sprint
        query = query.is("sprint_id", null)
      }

      const { data: updatedCards, error } = await query

      if (!error && updatedCards) {
        setCards(updatedCards as KanbanCard[])
      } else if (error) {
        console.error("Error fetching cards:", error)
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
    }
  }, [supabase, selectedSprintId])

  const fetchColumns = useCallback(async () => {
    try {
      const { data: updatedColumns, error } = await supabase
        .from("kanban_columns")
        .select("*")
        .order("position")

      if (!error && updatedColumns) {
        setColumns(updatedColumns as KanbanColumn[])
      } else if (error) {
        console.error("Error fetching columns:", error)
      }
    } catch (error) {
      console.error("Error fetching columns:", error)
    }
  }, [supabase])

  const fetchSprints = useCallback(async () => {
    try {
      const { data: updatedSprints, error } = await supabase
        .from("kanban_sprints")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && updatedSprints) {
        const typedSprints = updatedSprints as KanbanSprint[]
        setSprints(typedSprints)
        // If current sprint is no longer available, select the active one or first one
        if (selectedSprintId && !typedSprints.find(s => s.id === selectedSprintId)) {
          const activeSprint = typedSprints.find(s => s.is_active) || typedSprints[0]
          setSelectedSprintId(activeSprint?.id || null)
        }
      } else if (error) {
        console.error("Error fetching sprints:", error)
      }
    } catch (error) {
      console.error("Error fetching sprints:", error)
    }
  }, [supabase, selectedSprintId])

  const refreshData = useCallback(async () => {
    await Promise.all([fetchCards(), fetchColumns(), fetchSprints()])
  }, [fetchCards, fetchColumns, fetchSprints])

  useEffect(() => {
    // Subscribe to real-time changes
    const cardsChannel = supabase
      .channel("kanban_cards_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kanban_cards" }, () => {
        fetchCards()
      })
      .subscribe()

    const columnsChannel = supabase
      .channel("kanban_columns_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kanban_columns" }, () => {
        fetchColumns()
      })
      .subscribe()

    const sprintsChannel = supabase
      .channel("kanban_sprints_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kanban_sprints" }, () => {
        fetchSprints()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(columnsChannel)
      supabase.removeChannel(sprintsChannel)
    }
  }, [supabase, fetchCards, fetchColumns, fetchSprints])

  // Refetch cards when sprint changes
  useEffect(() => {
    fetchCards()
  }, [selectedSprintId, fetchCards])

  const handleAddCard = async (columnId: string, title: string, description: string) => {
    try {
      const columnCards = cards.filter(c => c.column_id === columnId)
      const maxPosition =
        columnCards.length > 0 ? Math.max(...columnCards.map(c => c.position), -1) + 1 : 0

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          column_id: columnId,
          title,
          description,
          position: maxPosition,
          sprint_id: selectedSprintId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add card")
      }

      // Fetch fresh data to see the new card
      await refreshData()
    } catch (error) {
      console.error("Error adding card:", error)
      throw error
    }
  }

  const handleUpdateCard = async (id: string, title: string, description: string) => {
    try {
      const response = await fetch("/api/cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          description,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update card")
      }

      // Fetch fresh data to see the updated card
      await refreshData()
    } catch (error) {
      console.error("Error updating card:", error)
      throw error
    }
  }

  const handleDeleteCard = async (id: string) => {
    try {
      const response = await fetch(`/api/cards?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete card")
      }

      // Fetch fresh data to reflect the deletion
      await refreshData()
    } catch (error) {
      console.error("Error deleting card:", error)
      throw error
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = cards.find(c => c.id === active.id)
    setActiveCard(card || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over || !isAdmin) return

    const cardId = active.id as string
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    const overId = over.id as string

    try {
      let updates: Array<{ id: string; position: number; column_id?: string }> = []

      // If dropped on a column
      if (overId.startsWith("column-")) {
        const newColumnId = overId.replace("column-", "")
        if (newColumnId === card.column_id) return

        const targetColumnCards = cards.filter(c => c.column_id === newColumnId && c.id !== cardId)
        const newPosition =
          targetColumnCards.length > 0
            ? Math.max(...targetColumnCards.map(c => c.position), -1) + 1
            : 0

        updates.push({
          id: cardId,
          column_id: newColumnId,
          position: newPosition,
        })
      } else {
        // If dropped on another card
        const targetCard = cards.find(c => c.id === overId)
        if (!targetCard || targetCard.id === cardId) return

        const targetColumnId = targetCard.column_id
        const isSameColumn = targetColumnId === card.column_id

        if (isSameColumn) {
          // Reorder within same column
          const columnCards = cards
            .filter(c => c.column_id === targetColumnId)
            .sort((a, b) => a.position - b.position)

          const oldIndex = columnCards.findIndex(c => c.id === cardId)
          const newIndex = columnCards.findIndex(c => c.id === overId)

          if (oldIndex === newIndex) return

          const updatedCards = [...columnCards]
          const [movedCard] = updatedCards.splice(oldIndex, 1)
          updatedCards.splice(newIndex, 0, movedCard)

          // Create updates for all cards in the column
          updates = updatedCards.map((c, index) => ({
            id: c.id,
            position: index,
          }))
        } else {
          // Move to different column
          const targetColumnCards = cards
            .filter(c => c.column_id === targetColumnId && c.id !== cardId)
            .sort((a, b) => a.position - b.position)

          const targetCardIndex = targetColumnCards.findIndex(c => c.id === overId)
          const newPosition = targetCardIndex >= 0 ? targetCardIndex + 1 : targetColumnCards.length

          // Update moved card
          updates.push({
            id: cardId,
            column_id: targetColumnId,
            position: newPosition,
          })

          // Update positions of cards in target column that come after the new position
          targetColumnCards.forEach((c, index) => {
            const newPos = index + (index >= newPosition ? 1 : 0)
            if (c.position !== newPos) {
              updates.push({
                id: c.id,
                position: newPos,
              })
            }
          })
        }
      }

      // Batch update via API
      const response = await fetch("/api/cards/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to move card")
      }

      // Fetch fresh data to see the new positions
      await refreshData()
    } catch (error) {
      console.error("Error moving card:", error)
      router.refresh() // Revert on error
    }
  }

  const handleCreateSprint = async () => {
    if (!newSprintName.trim()) return

    try {
      const response = await fetch("/api/sprints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSprintName,
          start_date: newSprintStartDate || null,
          end_date: newSprintEndDate || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create sprint")
      }

      const newSprint = await response.json()
      setNewSprintName("")
      setNewSprintStartDate("")
      setNewSprintEndDate("")
      setIsCreatingSprint(false)
      setSelectedSprintId(newSprint.id)
      await refreshData()
    } catch (error) {
      console.error("Error creating sprint:", error)
      alert(error instanceof Error ? error.message : "Failed to create sprint")
    }
  }

  const handleEndSprint = async () => {
    if (!selectedSprintId) return

    const currentSprint = sprints.find(s => s.id === selectedSprintId)
    if (!currentSprint?.is_active) {
      alert("This sprint is already inactive")
      return
    }

    if (!confirm(`Are you sure you want to end "${currentSprint.name}"?`)) {
      return
    }

    try {
      setIsEndingSprint(true)
      const response = await fetch("/api/sprints", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedSprintId,
          is_active: false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to end sprint")
      }

      // Switch to the next active sprint or first sprint
      await refreshData()
      const { data: updatedSprintsData } = await supabase
        .from("kanban_sprints")
        .select("*")
        .order("created_at", { ascending: false })

      if (updatedSprintsData) {
        const typedSprints = updatedSprintsData as KanbanSprint[]
        const activeSprint = typedSprints.find(s => s.is_active) || typedSprints[0]
        setSelectedSprintId(activeSprint?.id || null)
      }
    } catch (error) {
      console.error("Error ending sprint:", error)
      alert(error instanceof Error ? error.message : "Failed to end sprint")
    } finally {
      setIsEndingSprint(false)
    }
  }

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position)
  const currentSprint = sprints.find(s => s.id === selectedSprintId)

  const boardContent = (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto">
        <div className="flex">
          {sortedColumns.map(column => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              cards={cards.filter(card => card.column_id === column.id)}
              isAdmin={isAdmin}
              onAddCard={handleAddCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </div>
      <Dialog open={isCreatingSprint} onOpenChange={setIsCreatingSprint}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>
              Create a new sprint. The current sprint will be automatically ended.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sprint-name">Sprint Name</Label>
              <Input
                id="sprint-name"
                value={newSprintName}
                onChange={e => setNewSprintName(e.target.value)}
                placeholder="e.g., Sprint 2"
                onKeyDown={e => {
                  if (e.key === "Enter" && newSprintName.trim()) {
                    e.preventDefault()
                    handleCreateSprint()
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sprint-start-date">Start Date (optional)</Label>
                <Input
                  id="sprint-start-date"
                  type="date"
                  value={newSprintStartDate}
                  onChange={e => setNewSprintStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sprint-end-date">End Date (optional)</Label>
                <Input
                  id="sprint-end-date"
                  type="date"
                  value={newSprintEndDate}
                  onChange={e => setNewSprintEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreatingSprint(false)
                  setNewSprintName("")
                  setNewSprintStartDate("")
                  setNewSprintEndDate("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSprint} disabled={!newSprintName.trim()}>
                Create Sprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  // Only wrap in DndContext on client to avoid hydration mismatch
  if (!isMounted) {
    return boardContent
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
        <Label htmlFor="sprint-select" className="text-sm font-medium">
          Sprint:
        </Label>
        <select
          id="sprint-select"
          value={selectedSprintId || ""}
          onChange={e => setSelectedSprintId(e.target.value || null)}
          className="h-9 rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
        >
          {sprints.map(sprint => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name} {sprint.is_active && "(Active)"}
            </option>
          ))}
        </select>
      </div>
      <div className="border border-gray-300 bg-muted/40 rounded-[3px] ">{boardContent}</div>
      {isAdmin && (
        <div className="flex items-center gap-4 pt-4 border-t border-gray-300">
          <Button
            variant="outline"
            onClick={() => setIsCreatingSprint(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Sprint
          </Button>
          {currentSprint?.is_active && (
            <Button
              variant="outline"
              onClick={handleEndSprint}
              disabled={isEndingSprint}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {isEndingSprint ? "Ending..." : "End Current Sprint"}
            </Button>
          )}
        </div>
      )}
      <DragOverlay>
        {activeCard ? (
          <div className="p-4 bg-background border rounded-lg shadow-lg opacity-90 rotate-3">
            <h4 className="font-medium text-sm">{activeCard.title}</h4>
            {activeCard.description && (
              <p className="text-xs text-muted-foreground mt-1">{activeCard.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
