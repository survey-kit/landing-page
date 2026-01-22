import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, FileText } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/kanban-board"
import { LoginDialog } from "@/components/login-dialog"
import type { KanbanCard, KanbanColumn, KanbanSprint } from "@/types/kanban"
import { TextLoopSlogan } from "@/components/text-loop-slogan"
import { TiltCard } from "@/components/tilt-card"

import { FadeIn } from "@/components/fade-in"

export default async function Home() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const githubUsername = user?.user_metadata?.user_name
  const isAdmin = githubUsername === "sebtheo"

  const { data: columns } = await supabase.from("kanban_columns").select("*").order("position")

  const { data: sprints } = await supabase
    .from("kanban_sprints")
    .select("*")
    .order("created_at", { ascending: false })

  // Get active sprint or first sprint
  const activeSprintId = sprints?.find(s => s.is_active)?.id || sprints?.[0]?.id || null

  // Fetch cards for the active sprint (or all if no sprint selected)
  let cardsQuery = supabase.from("kanban_cards").select("*").order("position")
  if (activeSprintId) {
    cardsQuery = cardsQuery.eq("sprint_id", activeSprintId)
  } else {
    cardsQuery = cardsQuery.is("sprint_id", null)
  }
  const { data: cards } = await cardsQuery

  return (
    <main className="min-h-screen bg-background">
      <FadeIn className="sticky top-0 z-10 bg-white dark:border-white/10 dark:bg-zinc-950">
        <header className="px-6 py-5 lg:flex lg:h-16 lg:items-center lg:px-8 lg:py-0">
          <div className="mx-auto flex w-full items-center justify-between md:max-w-7xl">
            <a href="/" className="relative flex items-center space-x-2">
              <img src="/logo.png" alt="Survey Kit Logo" className="h-4" />
              <div className="text-md font-medium text-zinc-950 dark:text-white">SurveyKit</div>
              <span className="mb-4 ml-0 rounded-sm bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-50 select-none">
                beta
              </span>
            </a>
            <div className="flex items-center space-x-6">
              <nav className="hidden items-center space-x-6 sm:flex">
                <a
                  href="https://survey-kit.github.io/survey-kit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center text-sm font-medium text-zinc-700 hover:text-zinc-950 md:inline-flex dark:text-zinc-300 dark:hover:text-white"
                >
                  Docs
                </a>
                <a
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  href="https://template.survey-kit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
                <a
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  href="https://aws-template.survey-kit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Template
                </a>
              </nav>
              <div className="hidden h-8 w-[0.5px] bg-zinc-200 sm:flex dark:bg-zinc-800"></div>
              <nav className="flex items-center space-x-2">
                <a
                  href="https://github.com/ibelick/motion-primitives"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center"
                >
                  <Github size={16} />
                </a>
              </nav>
            </div>
          </div>
        </header>
      </FadeIn>
      {/* Align text and features to the left */}
      <div className="container mx-auto px-4 md:px-0 py-8 md:py-0 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center sm:text-left space-y-12">
          {/* Logo and Title */}
          <FadeIn delay={0.1}>
            <div className="pt-4 sm:pt-20 mb-4">
              <div className="flex flex-col justify-center">
                {/* Slogan aligned left */}
                <div className="">
                  <TextLoopSlogan />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.2}>
            <div className="space-y-6 w-full">
              <p className="text-sm sm:text-lg mx-auto text-muted-foreground leading-relaxed text-pretty max-w-md sm:max-w-lg text-center">
                A conversational survey experience designed for mobile devices. One question per
                page, fully accessible, and built for developers.
              </p>
            </div>
          </FadeIn>

          {/* Features */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto  my-0 ">
              <TiltCard
                title="Mobile-First Design"
                description="Conversational UI with one question per page for optimal mobile experience"
              />
              <TiltCard
                title="Fully Accessible"
                description="WCAG 2.2 AA compliant with keyboard navigation and screen reader support"
              />
              <TiltCard
                title="Developer Friendly"
                description="Built with React and TypeScript, configured with JSON or YAML"
              />
              <TiltCard
                title="Flexible & Extensible"
                description="Customisable components and validation with comprehensive documentation"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-between items-start pt-8">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <a
                  href="https://github.com/survey-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2 w-full sm:w-auto"
                >
                  <Github className="w-5 h-5" />
                  Star on GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                <a
                  href="https://template.survey-kit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2 w-full sm:w-auto"
                >
                  <FileText className="w-5 h-5" />
                  View Template
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
      <FadeIn delay={0.5}>
        <div className="w-full flex justify-center py-0 sm:py-12">
          <div className="border-t border-muted-foreground/20 w-full max-w-3xl" />
        </div>
      </FadeIn>
      {/* Align kanban content to left */}
      <div className="container mx-auto px-4 md:px-0 py-8 md:py-0 flex flex-col justify-center">
        <div className="space-y-8">
          <FadeIn delay={0.6}>
            <div className="flex-col sm:flex-row sm:items-center sm:justify-between mx-auto max-w-3xl ">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-3xl font-bold" id="board">
                  Project Board
                </h2>
                <div className="ml-auto">
                  <LoginDialog
                    user={
                      user
                        ? {
                            email: user.email!,
                            github_username: githubUsername,
                          }
                        : null
                    }
                  />
                </div>
              </div>
              <p className="text-muted-foreground mt-2 ">
                Track the development progress of Survey Kit
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.7}>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              <KanbanBoard
                initialColumns={(columns as KanbanColumn[]) || []}
                initialCards={(cards as KanbanCard[]) || []}
                initialSprints={(sprints as KanbanSprint[]) || []}
                isAdmin={isAdmin}
              />
            </div>
          </FadeIn>
        </div>
      </div>
      <FadeIn delay={0.8}>
        <div className="flex justify-center p-12">
          {/* Footer */}
          <div className="text-sm text-foreground text-center">
            <p>
              Made by{" "}
              <a
                href="https://github.com/sebtheo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                @sebtheo
              </a>{" "}
              in collaboration with{" "}
              <a
                href="https://github.com/ONS-Innovation"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                @ONS
              </a>
              .
            </p>
          </div>
        </div>
      </FadeIn>
    </main>
  )
}
