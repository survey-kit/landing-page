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
import type { KanbanCard, KanbanColumn } from "@/types/kanban"
import { KanbanColumnComponent } from "./kanban-column"
import { useRouter } from "next/navigation"

interface KanbanBoardProps {
  initialColumns: KanbanColumn[]
  initialCards: KanbanCard[]
  isAdmin: boolean
}

export function KanbanBoard({ initialColumns, initialCards, isAdmin }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [cards, setCards] = useState(initialCards)
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  const [isMounted, setIsMounted] = useState(false)
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
      const { data: updatedCards, error } = await supabase
        .from("kanban_cards")
        .select("*")
        .order("position")

      if (!error && updatedCards) {
        setCards(updatedCards as KanbanCard[])
      } else if (error) {
        console.error("Error fetching cards:", error)
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
    }
  }, [supabase])

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

  const refreshData = useCallback(async () => {
    await Promise.all([fetchCards(), fetchColumns()])
  }, [fetchCards, fetchColumns])

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

    return () => {
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(columnsChannel)
    }
  }, [supabase, fetchCards, fetchColumns])

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

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position)

  const boardContent = (
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
  )

  // Only wrap in DndContext on client to avoid hydration mismatch
  if (!isMounted) {
    return boardContent
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {boardContent}
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
