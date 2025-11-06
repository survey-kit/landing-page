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
    const { name, start_date, end_date } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Sprint name is required" }, { status: 400 })
    }

    // Validate and sanitise name length
    const sanitisedName = name.trim()
    if (sanitisedName.length === 0 || sanitisedName.length > 200) {
      return NextResponse.json(
        { error: "Sprint name must be between 1 and 200 characters" },
        { status: 400 }
      )
    }

    // Validate date formats if provided
    if (start_date && isNaN(Date.parse(start_date))) {
      return NextResponse.json({ error: "Invalid start date format" }, { status: 400 })
    }

    if (end_date && isNaN(Date.parse(end_date))) {
      return NextResponse.json({ error: "Invalid end date format" }, { status: 400 })
    }

    // Validate date logic
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 })
    }

    // Set all existing active sprints to inactive
    await supabase.from("kanban_sprints").update({ is_active: false }).eq("is_active", true)

    // Create new sprint as active
    const { data, error } = await supabase
      .from("kanban_sprints")
      .insert({
        name: sanitisedName,
        start_date: start_date || null,
        end_date: end_date || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[API] Error creating sprint:", error)
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
    const { id, is_active, name, start_date, end_date } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Missing sprint id" }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid sprint ID format" }, { status: 400 })
    }

    // Validate and sanitise inputs
    let sanitisedName: string | undefined
    if (name !== undefined) {
      const trimmed = name.trim()
      if (trimmed.length === 0 || trimmed.length > 200) {
        return NextResponse.json(
          { error: "Sprint name must be between 1 and 200 characters" },
          { status: 400 }
        )
      }
      sanitisedName = trimmed
    }

    if (start_date !== undefined && start_date !== null && isNaN(Date.parse(start_date))) {
      return NextResponse.json({ error: "Invalid start date format" }, { status: 400 })
    }

    if (end_date !== undefined && end_date !== null && isNaN(Date.parse(end_date))) {
      return NextResponse.json({ error: "Invalid end date format" }, { status: 400 })
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 })
    }

    const updateData: {
      name?: string
      start_date?: string | null
      end_date?: string | null
      is_active?: boolean
    } = {}

    if (name !== undefined) {
      updateData.name = sanitisedName
    }
    if (start_date !== undefined) {
      updateData.start_date = start_date || null
    }
    if (end_date !== undefined) {
      updateData.end_date = end_date || null
    }
    if (is_active !== undefined) {
      updateData.is_active = is_active
      // If setting this sprint to active, deactivate all others
      if (is_active) {
        await supabase.from("kanban_sprints").update({ is_active: false }).neq("id", id)
      }
    }

    const { data, error } = await supabase
      .from("kanban_sprints")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[API] Error updating sprint:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
