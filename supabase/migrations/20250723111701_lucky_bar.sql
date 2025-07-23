/*
  # Create students table with proper data insertion

  1. New Tables
    - `students` (if not exists)
      - `id` (uuid, primary key)
      - `name_bangla` (text, Bengali name)
      - `name_english` (text, English name)
      - `birth_certificate_no` (text, birth certificate number)
      - `blood_group` (text, blood group)
      - `class_id` (uuid, foreign key to classes)
      - `section_id` (uuid, foreign key to sections)
      - `admission_date` (date, when admitted)
      - `student_id` (text, unique student identifier)
      - `father_name` (text, father's name)
      - `mother_name` (text, mother's name)
      - `address` (text, home address)
      - `phone` (text, contact number)
      - `photo_url` (text, profile photo URL)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `students` table
    - Add policies for appropriate access

  3. Sample Data
    - Insert sample students with proper date casting