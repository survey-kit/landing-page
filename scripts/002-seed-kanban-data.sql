-- Insert default columns
INSERT INTO kanban_columns (title, position) VALUES
  ('To Do', 0),
  ('In Progress', 1),
  ('Done', 2)
ON CONFLICT DO NOTHING;

-- Insert sample cards
INSERT INTO kanban_cards (column_id, title, description, position)
SELECT 
  (SELECT id FROM kanban_columns WHERE title = 'To Do' LIMIT 1),
  'Welcome to Survey Kit',
  'This is a sample kanban board. Login as @sebtheo to make changes.',
  0
WHERE NOT EXISTS (SELECT 1 FROM kanban_cards);

INSERT INTO kanban_cards (column_id, title, description, position)
SELECT 
  (SELECT id FROM kanban_columns WHERE title = 'In Progress' LIMIT 1),
  'Building the framework',
  'Creating a mobile-first, accessible survey experience.',
  0
WHERE NOT EXISTS (SELECT 1 FROM kanban_cards LIMIT 1 OFFSET 1);

INSERT INTO kanban_cards (column_id, title, description, position)
SELECT 
  (SELECT id FROM kanban_columns WHERE title = 'Done' LIMIT 1),
  'Project setup',
  'Initial repository and documentation created.',
  0
WHERE NOT EXISTS (SELECT 1 FROM kanban_cards LIMIT 1 OFFSET 2);
