import { Tilt } from "@/components/ui/tilt"

export function TiltCard({ title, description }: { title: string; description: string }) {
  return (
    <Tilt rotationFactor={8} isRevese>
      <div
        className="flex flex-col overflow-hidden border border-zinc-950/20
        bg-white dark:border-zinc-50/10 dark:bg-zinc-900
        space-y-2 p-6 border bg-card w-full rounded-[3px] "
      >
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Tilt>
  )
}
