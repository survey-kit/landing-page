import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/kanban-board"
import { LoginDialog } from "@/components/login-dialog"
import type { KanbanCard, KanbanColumn } from "@/types/kanban"

export default async function Home() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const githubUsername = user?.user_metadata?.user_name
  const isAdmin = githubUsername === "sebtheo"

  const { data: columns } = await supabase.from("kanban_columns").select("*").order("position")

  const { data: cards } = await supabase.from("kanban_cards").select("*").order("position")

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:p-0 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Survey Kit Logo"
                width={120}
                height={120}
                className="w-24 h-24 md:w-32 md:h-32"
                priority
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Survey Kit
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-balance">
                Mobile-first, accessible survey framework
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
              A conversational survey experience designed for mobile devices. One question per page,
              fully accessible, and built for developers.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="space-y-2 p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Mobile-First Design</h3>
              <p className="text-sm text-muted-foreground">
                Conversational UI with one question per page for optimal mobile experience
              </p>
            </div>
            <div className="space-y-2 p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Fully Accessible</h3>
              <p className="text-sm text-muted-foreground">
                WCAG 2.2 AA compliant with keyboard navigation and screen reader support
              </p>
            </div>
            <div className="space-y-2 p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Developer Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Built with React and TypeScript, configured with JSON or YAML
              </p>
            </div>
            <div className="space-y-2 p-6 rounded-lg border bg-card">
              <h3 className="font-semibold">Flexible & Extensible</h3>
              <p className="text-sm text-muted-foreground">
                Customizable components and validation with comprehensive documentation
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild>
              <a
                href="https://github.com/survey-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-12 text-sm text-muted-foreground">
            <p>
              Made by{" "}
              <a
                href="https://github.com/sebtheo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                @sebtheo
              </a>
            </p>
          </div>
        </div>

        <div className="mt-24 space-y-8">
          <div className="flex-col sm:flex-row sm:items-center sm:justify-between mx-auto max-w-3xl">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-3xl font-bold">Project Board</h2>
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
            <p className="text-muted-foreground mt-2">
              Track the development progress of Survey Kit
            </p>
          </div>

          <div className="border border-gray-300 rounded-[3px] mx-auto">
            <KanbanBoard
              initialColumns={(columns as KanbanColumn[]) || []}
              initialCards={(cards as KanbanCard[]) || []}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
