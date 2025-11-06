export interface KanbanColumn {
  id: string
  title: string
  position: number
  created_at: string
}

export interface KanbanCard {
  id: string
  column_id: string
  title: string
  description: string | null
  position: number
  sprint_id: string | null
  created_at: string
  updated_at: string
}

export interface KanbanSprint {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
}
