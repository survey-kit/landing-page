"use client"

import { useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

type BannerProps = {
  children: ReactNode
  className?: string
}

export function Banner({ children, className }: BannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <motion.div
      className="[overflow-anchor:none]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        role="region"
        aria-label="Site notice"
        className={cn(
          "relative z-[60] flex w-full items-center justify-center gap-3 border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
          className
        )}
      >
        <p
          className={cn(
            "min-w-0 flex-1 pr-6 leading-snug sm:pr-0 [&_a]:font-medium [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a:hover]:opacity-90 [&_strong]:font-semibold"
          )}
        >
          {children}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 inline-flex p-1 shrink-0 -translate-y-1/2 items-center justify-center rounded-md text-amber-900/80 hover:bg-amber-200/60 hover:text-amber-950 dark:text-amber-200/90 dark:hover:bg-amber-900/50 dark:hover:text-amber-50"
          aria-label="Dismiss notice"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </motion.div>
  )
}
