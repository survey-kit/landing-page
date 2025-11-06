import { getSupabaseServerClient } from "@/lib/supabase/server"
import { verifyAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Verify admin authentication - this checks session validity and username
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { column_id, title, description, position, sprint_id } = body

    // Validate required fields
    if (!column_id || !title?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate UUID format for column_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(column_id)) {
      return NextResponse.json({ error: "Invalid column ID format" }, { status: 400 })
    }

    // Validate and sanitise title length
    const sanitisedTitle = title.trim()
    if (sanitisedTitle.length === 0 || sanitisedTitle.length > 500) {
      return NextResponse.json(
        { error: "Title must be between 1 and 500 characters" },
        { status: 400 }
      )
    }

    // Validate description length if provided
    if (description && description.trim().length > 2000) {
      return NextResponse.json(
        { error: "Description must be less than 2000 characters" },
        { status: 400 }
      )
    }

    // Validate position is a number
    if (
      position !== undefined &&
      (typeof position !== "number" || position < 0 || !Number.isInteger(position))
    ) {
      return NextResponse.json(
        { error: "Position must be a non-negative integer" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("kanban_cards")
      .insert({
        column_id,
        title: sanitisedTitle,
        description: description ? description.trim() : null,
        position: position ?? 0,
        sprint_id: sprint_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[API] Error creating card:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    const body = await request.json()
    const { id, title, description, column_id, position } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Missing card id" }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid card ID format" }, { status: 400 })
    }

    // Validate and sanitise inputs
    let sanitisedTitle: string | undefined
    if (title !== undefined) {
      const trimmed = title.trim()
      if (trimmed.length === 0 || trimmed.length > 500) {
        return NextResponse.json(
          { error: "Title must be between 1 and 500 characters" },
          { status: 400 }
        )
      }
      sanitisedTitle = trimmed
    }

    let sanitisedDescription: string | null | undefined
    if (description !== undefined) {
      const trimmed = description === null ? null : description.trim()
      if (trimmed !== null && trimmed.length > 2000) {
        return NextResponse.json(
          { error: "Description must be less than 2000 characters" },
          { status: 400 }
        )
      }
      sanitisedDescription = trimmed
    }

    if (column_id !== undefined) {
      if (!uuidRegex.test(column_id)) {
        return NextResponse.json({ error: "Invalid column ID format" }, { status: 400 })
      }
    }

    if (
      position !== undefined &&
      (typeof position !== "number" || position < 0 || !Number.isInteger(position))
    ) {
      return NextResponse.json(
        { error: "Position must be a non-negative integer" },
        { status: 400 }
      )
    }

    const updateData: {
      updated_at: string
      title?: string
      description?: string | null
      column_id?: string
      position?: number
    } = {
      updated_at: new Date().toISOString(),
    }

    if (title !== undefined) {
      updateData.title = sanitisedTitle
    }
    if (description !== undefined) {
      updateData.description = sanitisedDescription
    }
    if (column_id !== undefined) {
      updateData.column_id = column_id
    }
    if (position !== undefined) {
      updateData.position = position
    }

    const { data, error } = await supabase
      .from("kanban_cards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[API] Error updating card:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing card id" }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid card ID format" }, { status: 400 })
    }

    const { error } = await supabase.from("kanban_cards").delete().eq("id", id)

    if (error) {
      console.error("[API] Error deleting card:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
