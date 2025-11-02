-- Fix RLS policies to use correct GitHub username field (user_name instead of github_username)

-- Drop existing policies
DROP POLICY IF EXISTS "Allow sebtheo to insert kanban_columns" ON kanban_columns;
DROP POLICY IF EXISTS "Allow sebtheo to update kanban_columns" ON kanban_columns;
DROP POLICY IF EXISTS "Allow sebtheo to delete kanban_columns" ON kanban_columns;
DROP POLICY IF EXISTS "Allow sebtheo to insert kanban_cards" ON kanban_cards;
DROP POLICY IF EXISTS "Allow sebtheo to update kanban_cards" ON kanban_cards;
DROP POLICY IF EXISTS "Allow sebtheo to delete kanban_cards" ON kanban_cards;

-- Recreate policies with correct field name (user_name)
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
