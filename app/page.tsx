import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/kanban-board"
import { LoginDialog } from "@/components/login-dialog"
import type { KanbanCard, KanbanColumn, KanbanSprint } from "@/types/kanban"
import { TextLoopSlogan } from "@/components/text-loop-slogan"
import { TiltCard } from "@/components/tilt-card"
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
      {/* Align text and features to the left */}
      <div className="container mx-auto px-4 md:px-0 py-8 md:py-0 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center sm:text-left space-y-12">
          {/* Logo and Title */}
          <div className="mt-4 sm:mt-16">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance flex sm:flex-row flex-col-reverse items-center justify-center sm:justify-start mb-4 sm:mb-0">
                Survey Kit
                <Image
                  src="/logo.png"
                  alt="Survey Kit Logo"
                  width={120}
                  height={120}
                  className="w-32 h-32 md:w-16 md:h-16"
                  priority
                />
              </h1>
              {/* Slogan aligned left */}
              <div className="">
                <TextLoopSlogan />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl ">
              A conversational survey experience designed for mobile devices. One question per page,
              fully accessible, and built for developers.
            </p>
          </div>

          {/* Features */}
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
          <div className="flex sm:flex-row gap-4 justify-center md:justify-start items-start pt-8">
            <Button size="lg" asChild>
              <a
                href="https://github.com/survey-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2 w-full sm:w-auto"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center py-0 sm:py-12">
        <div className="border-t border-muted-foreground/20 w-full max-w-3xl" />
      </div>
      {/* Align kanban content to left */}
      <div className="container mx-auto px-4 md:px-0 py-8 md:py-0 flex flex-col justify-center">
        <div className="space-y-8">
          <div className="flex-col sm:flex-row sm:items-center sm:justify-between mx-auto max-w-3xl ">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-3xl font-bold ">Project Board</h2>
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

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <KanbanBoard
              initialColumns={(columns as KanbanColumn[]) || []}
              initialCards={(cards as KanbanCard[]) || []}
              initialSprints={(sprints as KanbanSprint[]) || []}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
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
    </main>
  )
}
