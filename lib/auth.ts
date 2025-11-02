import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Verifies that the user is authenticated and is the admin (sebtheo)
 * Returns the user if authenticated as admin, null otherwise
 * Throws an error if authentication check fails
 */
export async function verifyAdmin(): Promise<{
  id: string
  email?: string
  username: string
} | null> {
  try {
    const supabase = await getSupabaseServerClient()

    // Get the authenticated user - this verifies the session from cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // If no user or auth error, user is not authenticated
    if (authError || !user) {
      return null
    }

    // Verify the session is still valid
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return null
    }

    // Check if user is the admin (sebtheo)
    const githubUsername = user.user_metadata?.user_name
    if (githubUsername !== "sebtheo") {
      return null
    }

    // Return user info if all checks pass
    return {
      id: user.id,
      email: user.email,
      username: githubUsername,
    }
  } catch (error) {
    console.error("[Auth] Error verifying admin:", error)
    return null
  }
}

/**
 * Check if a user is authenticated (without admin check)
 */
export async function verifyAuth(): Promise<{ id: string; email?: string } | null> {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
    }
  } catch (error) {
    console.error("[Auth] Error verifying auth:", error)
    return null
  }
}
