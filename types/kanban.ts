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
  created_at: string
  updated_at: string
}
