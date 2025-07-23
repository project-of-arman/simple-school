/*
  # Create classes and sections tables

  1. New Tables
    - `classes`
      - `id` (uuid, primary key)
      - `name` (text, class name like "Class 1", "SSC")
      - `numeric_value` (integer, for ordering)
      - `class_type` (text, primary/secondary/higher_secondary)
      - `created_at` (timestamp)
    
    - `sections`
      - `id` (uuid, primary key)
      - `class_id` (uuid, foreign key to classes)
      - `section_name` (text, like "A", "B", "C")
      - `teacher_id` (uuid, foreign key to teachers - will be added later)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  numeric_value integer NOT NULL,
  class_type text NOT NULL CHECK (class_type IN ('primary', 'secondary', 'higher_secondary')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  teacher_id uuid, -- Will reference teachers table when created
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access for classes and sections
CREATE POLICY "Allow public read access to classes"
  ON classes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to sections"
  ON sections
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample classes
INSERT INTO classes (name, numeric_value, class_type) VALUES
  ('Play Group', 0, 'primary'),
  ('Nursery', 1, 'primary'),
  ('Class 1', 2, 'primary'),
  ('Class 2', 3, 'primary'),
  ('Class 3', 4, 'primary'),
  ('Class 4', 5, 'primary'),
  ('Class 5', 6, 'primary'),
  ('Class 6', 7, 'secondary'),
  ('Class 7', 8, 'secondary'),
  ('Class 8', 9, 'secondary'),
  ('Class 9', 10, 'secondary'),
  ('Class 10 (SSC)', 11, 'secondary'),
  ('Class 11 (HSC)', 12, 'higher_secondary'),
  ('Class 12 (HSC)', 13, 'higher_secondary')
ON CONFLICT DO NOTHING;