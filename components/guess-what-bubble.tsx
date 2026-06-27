"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { cn } from "@/lib/utils"

const PHOTO_SRC = "/sebastian.jpg"
const PHOTO_FALLBACK = "https://avatars.githubusercontent.com/u/180557538?v=4"
const PORTFOLIO_URL = "https://sebtheo.uk?utm_source=surveykit"
const TEASER_DISMISS_KEY = "guess-what-teaser-dismissed"

const CONFETTI_OPTIONS = {
  particleCount: 100,
  spread: 80,
  origin: { y: 0.55 },
  colors: ["#fbbf24", "#f472b6", "#60a5fa", "#34d399", "#a78bfa"],
}

export function GuessWhatBubble() {
  const [teaserVisible, setTeaserVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [photoSrc, setPhotoSrc] = useState(PHOTO_SRC)
  const confettiRef = useRef<ConfettiRef>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const dismissed = sessionStorage.getItem(TEASER_DISMISS_KEY)
    if (!dismissed) {
      const timer = window.setTimeout(() => setTeaserVisible(true), 1800)
      return () => window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!dialogOpen) return

    const timer = window.setTimeout(() => {
      confettiRef.current?.fire(CONFETTI_OPTIONS)
    }, 200)

    return () => window.clearTimeout(timer)
  }, [dialogOpen])

  const fireCelebration = () => {
    confettiRef.current?.fire(CONFETTI_OPTIONS)
  }

  const openDialog = () => {
    setTeaserVisible(false)
    setDialogOpen(true)
  }

  const floatTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 2.8, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const }

  return (
    <>
      <AnimatePresence>
        {teaserVisible && (
          <motion.div
            className="fixed inset-x-0 bottom-6 sm:bottom-5 z-40 flex flex-col items-center gap-2 px-6 sm:px-0 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end sm:px-0"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            <motion.button
              type="button"
              onClick={openDialog}
              aria-label="Open a message from Sebastian"
              className={cn(
                "group relative flex w-fit items-center gap-3 rounded-lg sm:rounded-[1rem] border border-green-200/80 bg-gradient-to-br from-green-50 via-white to-green-50 sm:w-auto",
                "px-4 py-3 pr-5 text-left shadow-[0_12px_40px_-12px_rgba(34,197,94,0.45)]",
                "transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70",
                "dark:border-gray-500/50 dark:from-green-950 dark:via-zinc-900 dark:to-green-950",
                "cursor-pointer"
              )}
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={floatTransition}
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md dark:border-zinc-800">
                <Image
                  src={photoSrc}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  onError={() => setPhotoSrc(PHOTO_FALLBACK)}
                />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-950 dark:text-green-100">
                  Guess what?!
                </span>
                <span className="mt-0.5 block text-sm text-green-900 dark:text-green-100/70">
                  Tap for a little update from me
                </span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Confetti
          ref={confettiRef}
          manualstart
          className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
        />
        <DialogContent
          showCloseButton
          className={cn(
            "overflow-hidden border-green-200/60 p-0 sm:max-w-md",
            "bg-gradient-to-b from-green-50 via-background to-background",
            "dark:border-gray-500/50 dark:from-green-950 dark:via-background dark:to-background"
          )}
        >
          <div className="relative px-3 pt-8 pb-6">
            <motion.div
              className="mx-auto mb-5 flex justify-center"
              initial={reduceMotion ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.05 }}
            >
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-2 rounded-full bg-gradient-to-tr from-green-400/40 via-amber-300/30 to-green-400/40 blur-md"
                />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-800">
                  <Image
                    src={photoSrc}
                    alt="Sebastian"
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    onError={() => setPhotoSrc(PHOTO_FALLBACK)}
                  />
                </div>
                <motion.span
                  aria-hidden
                  className="absolute -right-1 top-0 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow"
                  initial={reduceMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.25 }}
                >
                  1st Class
                </motion.span>
              </div>
            </motion.div>

            <DialogHeader className="space-y-3 text-center sm:text-center">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                A little dissertation update
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-foreground/85">
                I&apos;m proud to say this project received{" "}
                <span className="font-semibold text-green-700 dark:text-green-300">80.58%</span>.
                Allowing me to graduate with a{" "}
                <span className="font-semibold text-green-700 dark:text-green-300">
                  1st Class Honours
                </span>{" "}
                degree.
                <br />
                Check out my portfolio:{" "}
                <Link
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-green-700 underline underline-offset-4 transition-opacity hover:opacity-80 dark:text-green-300"
                >
                  sebtheo.uk
                </Link>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild className="rounded-md">
                <Link href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
                  Visit sebtheo.uk
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => setDialogOpen(false)}
                >
                  Back to Survey Kit
                </Button>
                <button
                  type="button"
                  onClick={fireCelebration}
                  aria-label="Celebrate again"
                  className="cursor-pointer transition-transform hover:scale-[1.05] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-background text-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  🎉
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
