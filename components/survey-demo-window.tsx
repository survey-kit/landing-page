"use client"

import { useState } from "react"
import { LayoutTemplate, MessageCircle } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const FORM_SURVEY_URL =
  "https://aws-template.survey-kit.com/survey-1?page=page-primary-contact#page-primary-contact"
const CHAT_SURVEY_URL = "https://aws-template.survey-kit.com/chat-survey"

const lightClass =
  "size-3 shrink-0 rounded-full ring-1 ring-black/10 transition-transform hover:scale-110 dark:ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function TrafficLights({
  className,
  onCollapse,
  onExpand,
}: {
  className?: string
  onCollapse: () => void
  onExpand: () => void
}) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label="Window controls"
    >
      <button
        type="button"
        className={cn(lightClass, "bg-[#ff5f57]")}
        aria-label="Hide demo content (close)"
        onClick={onCollapse}
      />
      <button
        type="button"
        className={cn(lightClass, "bg-[#febc2e]")}
        aria-label="Hide demo content (minimize)"
        onClick={onCollapse}
      />
      <button
        type="button"
        className={cn(lightClass, "bg-[#28c840]")}
        aria-label="Show demo content"
        onClick={onExpand}
      />
    </div>
  )
}

export function SurveyDemoWindow({ className }: { className?: string }) {
  const [contentCollapsed, setContentCollapsed] = useState(false)

  return (
    <Tabs defaultValue="form" className={cn("w-full", className)}>
      <div
        className={cn(
          // On small, only top and bottom borders (border-x-0 border-t border-b), on sm+ all borders
          "flex flex-col gap-0 overflow-hidden rounded-none border-t border-b border-x-0 sm:rounded-2xl sm:border sm:border-x sm:border-border/80 bg-card shadow-xl",
          "ring-1 ring-black/5 dark:ring-white/10"
        )}
      >
        <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border/80 bg-muted/40 px-3 dark:bg-muted/25">
          <TrafficLights
            className="shrink-0"
            onCollapse={() => setContentCollapsed(true)}
            onExpand={() => setContentCollapsed(false)}
          />
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            Survey Kit Demo
          </span>
          {contentCollapsed ? (
            <span className="truncate text-xs text-muted-foreground" aria-live="polite">
              Click green to show demo
            </span>
          ) : null}
          <TabsList
            variant="line"
            className="ml-auto h-8 w-auto min-w-0 shrink gap-0 rounded-lg bg-muted/80 p-0.5 dark:bg-muted/50"
          >
            <TabsTrigger
              value="form"
              className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm after:hidden"
            >
              <LayoutTemplate className="size-3.5 opacity-70" aria-hidden />
              Form survey
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="h-7 rounded-md px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm after:hidden"
            >
              <MessageCircle className="size-3.5 opacity-70" aria-hidden />
              Chat (mobile)
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn(contentCollapsed && "hidden")} aria-hidden={contentCollapsed}>
          <TabsContent value="form" forceMount className="mt-0 data-[state=inactive]:hidden">
            <iframe
              title="Survey Kit form survey demo on AWS"
              src={FORM_SURVEY_URL}
              className="block h-[min(70vh,720px)] w-full border-0 bg-background sm:h-[min(72vh,760px)]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </TabsContent>

          <TabsContent value="chat" forceMount className="mt-0 data-[state=inactive]:hidden">
            <div className="flex justify-center bg-muted/30 px-4 py-8 dark:bg-muted/15">
              <div
                className={cn(
                  "w-full max-w-[390px] overflow-hidden rounded-[2.25rem] border-[10px] border-zinc-800 bg-zinc-900 shadow-inner",
                  "dark:border-zinc-700"
                )}
              >
                <iframe
                  title="Survey Kit chat survey demo on AWS (mobile preview)"
                  src={CHAT_SURVEY_URL}
                  className="block h-[min(72vh,780px)] w-full border-0 bg-background sm:h-[min(76vh,820px)]"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
