import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-12 text-center">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Survey Kit Logo"
                width={120}
                height={120}
                className="h-24 w-24 md:h-32 md:w-32"
                priority
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
                Survey Kit
              </h1>
              <p className="text-muted-foreground text-xl text-balance md:text-2xl">
                Mobile-first, accessible survey framework
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed text-pretty">
              A conversational survey experience designed for mobile devices. One question per page,
              fully accessible, and built for developers.
            </p>
          </div>

          {/* Features */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 text-left md:grid-cols-2">
            <div className="bg-card space-y-2 rounded-lg border p-6">
              <h3 className="font-semibold">Mobile-First Design</h3>
              <p className="text-muted-foreground text-sm">
                Conversational UI with one question per page for optimal mobile experience
              </p>
            </div>
            <div className="bg-card space-y-2 rounded-lg border p-6">
              <h3 className="font-semibold">Fully Accessible</h3>
              <p className="text-muted-foreground text-sm">
                WCAG 2.2 AA compliant with keyboard navigation and screen reader support
              </p>
            </div>
            <div className="bg-card space-y-2 rounded-lg border p-6">
              <h3 className="font-semibold">Developer Friendly</h3>
              <p className="text-muted-foreground text-sm">
                Built with React and TypeScript, configured with JSON or YAML
              </p>
            </div>
            <div className="bg-card space-y-2 rounded-lg border p-6">
              <h3 className="font-semibold">Flexible & Extensible</h3>
              <p className="text-muted-foreground text-sm">
                Customizable components and validation with comprehensive documentation
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button size="lg" asChild>
              <a
                href="https://github.com/survey-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-muted-foreground pt-12 text-sm">
            <p>
              Made by{" "}
              <a
                href="https://github.com/sebtheo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline underline-offset-4 transition-colors"
              >
                @sebtheo
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
