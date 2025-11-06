-- Create sprints table
CREATE TABLE IF NOT EXISTS kanban_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sprint_id to kanban_cards table
ALTER TABLE kanban_cards 
ADD COLUMN IF NOT EXISTS sprint_id UUID REFERENCES kanban_sprints(id) ON DELETE SET NULL;

-- Create index for sprint_id
CREATE INDEX IF NOT EXISTS idx_kanban_cards_sprint_id ON kanban_cards(sprint_id);

-- Enable Row Level Security on sprints
ALTER TABLE kanban_sprints ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access on sprints
CREATE POLICY "Allow public read access on kanban_sprints"
  ON kanban_sprints FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users with user_name = 'sebtheo'
CREATE POLICY "Allow sebtheo to insert kanban_sprints"
  ON kanban_sprints FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to update kanban_sprints"
  ON kanban_sprints FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to delete kanban_sprints"
  ON kanban_sprints FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

-- Create a default sprint
INSERT INTO kanban_sprints (name, is_active) 
VALUES ('Sprint 1', true)
ON CONFLICT DO NOTHING;

-- Update existing cards to belong to the default sprint
UPDATE kanban_cards
SET sprint_id = (SELECT id FROM kanban_sprints WHERE is_active = true LIMIT 1)
WHERE sprint_id IS NULL;

