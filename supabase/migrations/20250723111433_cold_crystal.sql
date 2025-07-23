/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `name_bangla` (text, Bengali name)
      - `name_english` (text, English name)
      - `designation` (text, job title)
      - `qualification` (text, educational background)
      - `subject_specialization` (text, subject expertise)
      - `joining_date` (date, when they joined)
      - `employee_id` (text, unique employee identifier)
      - `phone` (text, contact number)
      - `email` (text, email address)
      - `address` (text, home address)
      - `photo_url` (text, profile photo URL)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `teachers` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bangla text NOT NULL,
  name_english text NOT NULL,
  designation text NOT NULL,
  qualification text NOT NULL,
  subject_specialization text NOT NULL,
  joining_date date NOT NULL,
  employee_id text UNIQUE NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  address text NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Allow public read access for teachers
CREATE POLICY "Allow public read access to teachers"
  ON teachers
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to manage teachers (for admin functionality)
CREATE POLICY "Allow authenticated users to manage teachers"
  ON teachers
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample teachers
INSERT INTO teachers (name_bangla, name_english, designation, qualification, subject_specialization, joining_date, employee_id, phone, email, address) VALUES
  ('মোহাম্মদ রহিম উদ্দিন', 'Mohammad Rahim Uddin', 'প্রধান শিক্ষক', 'M.A in Bengali, B.Ed', 'Bengali Literature', '2015-01-15', 'TCH001', '+8801712345678', 'rahim@school.edu.bd', 'Dhaka, Bangladesh'),
  ('ফাতেমা খাতুন', 'Fatema Khatun', 'সহকারী শিক্ষক', 'M.Sc in Mathematics, B.Ed', 'Mathematics', '2016-03-20', 'TCH002', '+8801812345679', 'fatema@school.edu.bd', 'Dhaka, Bangladesh'),
  ('আব্দুল করিম', 'Abdul Karim', 'সহকারী শিক্ষক', 'M.A in English, B.Ed', 'English Literature', '2017-07-10', 'TCH003', '+8801912345680', 'karim@school.edu.bd', 'Dhaka, Bangladesh'),
  ('রাশিদা বেগম', 'Rashida Begum', 'সহকারী শিক্ষক', 'M.Sc in Physics, B.Ed', 'Physics', '2018-02-05', 'TCH004', '+8801612345681', 'rashida@school.edu.bd', 'Dhaka, Bangladesh'),
  ('মোহাম্মদ আলী', 'Mohammad Ali', 'সহকারী শিক্ষক', 'M.Sc in Chemistry, B.Ed', 'Chemistry', '2018-08-15', 'TCH005', '+8801512345682', 'ali@school.edu.bd', 'Dhaka, Bangladesh'),
  ('সালমা আক্তার', 'Salma Akter', 'সহকারী শিক্ষক', 'M.A in History, B.Ed', 'History', '2019-01-20', 'TCH006', '+8801412345683', 'salma@school.edu.bd', 'Dhaka, Bangladesh')
ON CONFLICT (employee_id) DO NOTHING;

-- Now update sections table to add foreign key constraint to teachers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'sections_teacher_id_fkey'
  ) THEN
    ALTER TABLE sections ADD CONSTRAINT sections_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES teachers(id);
  END IF;
END $$;

-- Insert sample sections
INSERT INTO sections (class_id, section_name, teacher_id) 
SELECT 
  c.id,
  section_name,
  (SELECT id FROM teachers ORDER BY random() LIMIT 1)
FROM classes c
CROSS JOIN (VALUES ('A'), ('B')) AS s(section_name)
WHERE c.numeric_value BETWEEN 2 AND 13
ON CONFLICT DO NOTHING;