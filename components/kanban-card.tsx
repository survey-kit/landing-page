"use client"

import { useState, useEffect } from "react"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { KanbanCard } from "@/types/kanban"
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
import { CardMorphDialog } from "@/components/card-morph-dialog"

interface KanbanCardComponentProps {
  card: KanbanCard
  isAdmin: boolean
  onUpdate: (id: string, title: string, description: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function KanbanCardComponent({
  card,
  isAdmin,
  onUpdate,
  onDelete,
}: KanbanCardComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || "")
  const [loading, setLoading] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
    disabled: !isAdmin,
    data: {
      type: "card",
      card,
    },
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: card.id,
    disabled: !isAdmin,
    data: {
      type: "card",
      card,
    },
  })

  // Combine refs for both drag and drop
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node)
    setDropRef(node)
  }

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  // Sync state when card prop changes
  useEffect(() => {
    setTitle(card.title)
    setDescription(card.description || "")
  }, [card.title, card.description])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isEditing) {
      setTitle(card.title)
      setDescription(card.description || "")
    }
  }, [isEditing, card.title, card.description])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await onUpdate(card.id, title, description)
      setIsEditing(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this card?")) {
      setLoading(true)
      try {
        await onDelete(card.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const [hasDragged, setHasDragged] = useState(false)

  // Track if we're dragging to prevent dialog from opening
  useEffect(() => {
    if (isDragging) {
      setHasDragged(true)
    } else {
      // Reset after a short delay to allow click events to be processed
      const timer = setTimeout(() => setHasDragged(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isDragging])

  const cardContent = (
    <Card
      ref={setNodeRef}
      style={style}
      {...(isAdmin ? { ...attributes, ...listeners } : {})}
      className={`p-4 space-y-2 transition-shadow ${
        isAdmin
          ? "cursor-grab active:cursor-grabbing hover:shadow-md"
          : "cursor-pointer hover:shadow-md"
      } ${isDragging ? "shadow-lg" : ""} ${isOver && !isDragging ? "ring-2 ring-primary ring-offset-2" : ""}`}
      onClick={e => {
        // Prevent dialog from opening if we just dragged
        if (hasDragged) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm">{card.title}</h4>
        {isAdmin && (
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation()
                handleDelete()
              }}
              disabled={loading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {card.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
      )}
    </Card>
  )

  return (
    <>
      <CardMorphDialog card={card} disabled={isDragging || hasDragged}>
        {cardContent}
      </CardMorphDialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>Update the card title and description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-title">Title</Label>
              <Input
                id="card-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault()
                    handleUpdate()
                  }
                }}
                placeholder="Enter card title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-description">Description</Label>
              <Textarea
                id="card-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter card description (optional)"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={loading || !title.trim()}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
