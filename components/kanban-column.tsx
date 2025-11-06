"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { KanbanCard, KanbanColumn } from "@/types/kanban"
import { KanbanCardComponent } from "./kanban-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface KanbanColumnComponentProps {
  column: KanbanColumn
  cards: KanbanCard[]
  isAdmin: boolean
  onAddCard: (columnId: string, title: string, description: string) => Promise<void>
  onUpdateCard: (id: string, title: string, description: string) => Promise<void>
  onDeleteCard: (id: string) => Promise<void>
}

export function KanbanColumnComponent({
  column,
  cards,
  isAdmin,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: KanbanColumnComponentProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      await onAddCard(column.id, title, description)
      setTitle("")
      setDescription("")
      setIsAdding(false)
    } finally {
      setLoading(false)
    }
  }

  const sortedCards = [...cards].sort((a, b) => a.position - b.position)

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  })

  return (
    <div className="flex flex-col gap-4 min-w-[280px] md:min-w-[320px] p-4 border-gray-400 border-r last:border-r-0">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{column.title}</h3>
        <span className="text-sm text-muted-foreground">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] p-0 rounded-lg transition-colors ${
          isOver ? "bg-muted/40 border-primary/50" : ""
        }`}
      >
        {sortedCards.map(card => (
          <KanbanCardComponent
            key={card.id}
            card={card}
            isAdmin={isAdmin}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}

        {isAdmin && (
          <Button variant="default" className="w-full" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        )}
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Card</DialogTitle>
            <DialogDescription>Create a new card in {column.title}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-card-title">Title</Label>
              <Input
                id="new-card-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Card title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-card-description">Description</Label>
              <Textarea
                id="new-card-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Card description (optional)"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setTitle("")
                  setDescription("")
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={loading || !title.trim()}>
                {loading ? "Adding..." : "Add Card"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
