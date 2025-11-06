"use client"

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog"
import type { KanbanCard } from "@/types/kanban"
import { format } from "date-fns"

interface CardMorphDialogProps {
  card: KanbanCard
  children: React.ReactNode
  disabled?: boolean
}

export function CardMorphDialog({ card, children, disabled }: CardMorphDialogProps) {
  const createdDate = card.created_at ? format(new Date(card.created_at), "MMM d, yyyy") : ""
  const updatedDate = card.updated_at ? format(new Date(card.updated_at), "MMM d, yyyy") : ""

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "12px",
        }}
        className="w-full text-left"
        disabled={disabled}
      >
        {children}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "3px",
          }}
          className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[600px] max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 space-y-4">
            <div>
              <MorphingDialogTitle className="text-3xl text-zinc-950 dark:text-zinc-50">
                {card.title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400 mt-2">
                {createdDate && `Created ${createdDate}`}
                {updatedDate && createdDate !== updatedDate && ` • Updated ${updatedDate}`}
              </MorphingDialogSubtitle>
            </div>
            {card.description && (
              <MorphingDialogDescription
                disableLayoutAnimation
                variants={{
                  initial: { opacity: 0, scale: 0.8, y: 100 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.8, y: 100 },
                }}
              >
                <div className="mt-4 space-y-3">
                  <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed whitespace-pre-wrap">
                    {card.description}
                  </p>
                </div>
              </MorphingDialogDescription>
            )}
            {!card.description && (
              <MorphingDialogDescription
                disableLayoutAnimation
                variants={{
                  initial: { opacity: 0, scale: 0.8, y: 100 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.8, y: 100 },
                }}
              >
                <p className="mt-4 text-zinc-500 dark:text-zinc-500 italic">
                  No description provided.
                </p>
              </MorphingDialogDescription>
            )}
          </div>
          <MorphingDialogClose className="text-zinc-950 dark:text-zinc-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}
