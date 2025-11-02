-- Create kanban_columns table
CREATE TABLE IF NOT EXISTS kanban_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kanban_cards table
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id UUID NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on kanban_columns"
  ON kanban_columns FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on kanban_cards"
  ON kanban_cards FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users with user_name = 'sebtheo'
-- Note: GitHub OAuth stores username as 'user_name' in user_metadata
CREATE POLICY "Allow sebtheo to insert kanban_columns"
  ON kanban_columns FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to update kanban_columns"
  ON kanban_columns FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to delete kanban_columns"
  ON kanban_columns FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to insert kanban_cards"
  ON kanban_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to update kanban_cards"
  ON kanban_cards FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

CREATE POLICY "Allow sebtheo to delete kanban_cards"
  ON kanban_cards FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'sebtheo'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kanban_columns_position ON kanban_columns(position);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_column_id ON kanban_cards(column_id);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_position ON kanban_cards(position);
