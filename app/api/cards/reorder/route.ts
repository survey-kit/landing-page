import { getSupabaseServerClient } from "@/lib/supabase/server"
import { verifyAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    const body = await request.json()
    const { updates } = body // Array of { id, position, column_id? }

    // Validate updates array
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Missing updates array" }, { status: 400 })
    }

    // Validate each update object
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    for (const update of updates) {
      if (!update.id || !uuidRegex.test(update.id)) {
        return NextResponse.json({ error: "Invalid card ID in updates" }, { status: 400 })
      }

      if (
        typeof update.position !== "number" ||
        update.position < 0 ||
        !Number.isInteger(update.position)
      ) {
        return NextResponse.json(
          { error: "Position must be a non-negative integer" },
          { status: 400 }
        )
      }

      if (update.column_id !== undefined && !uuidRegex.test(update.column_id)) {
        return NextResponse.json({ error: "Invalid column ID in updates" }, { status: 400 })
      }
    }

    // Limit batch size to prevent abuse
    if (updates.length > 100) {
      return NextResponse.json({ error: "Too many updates in batch (max 100)" }, { status: 400 })
    }

    // Batch update all cards
    const promises = updates.map((update: { id: string; position: number; column_id?: string }) => {
      const updateData: {
        position: number
        updated_at: string
        column_id?: string
      } = {
        position: update.position,
        updated_at: new Date().toISOString(),
      }

      if (update.column_id !== undefined) {
        updateData.column_id = update.column_id
      }

      return supabase.from("kanban_cards").update(updateData).eq("id", update.id)
    })

    const results = await Promise.all(promises)

    const hasError = results.some(result => result.error)
    if (hasError) {
      const firstError = results.find(result => result.error)
      console.error("[API] Error reordering cards:", firstError?.error)
      return NextResponse.json(
        { error: firstError?.error?.message || "Error updating cards" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
