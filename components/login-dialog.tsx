"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogIn, LogOut, Github } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginDialogProps {
  user: { email: string; github_username?: string } | null
}

export function LoginDialog({ user }: LoginDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center space-between gap-4">
        <Button variant="default" size="sm" onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="cursor-pointer">
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login with GitHub</DialogTitle>
          <DialogDescription>
            Login to manage the kanban board. Only @sebtheo can make changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={handleGitHubLogin} className="w-full" disabled={loading}>
            <Github className="w-4 h-4 mr-2" />
            {loading ? "Redirecting to GitHub..." : "Continue with GitHub"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
