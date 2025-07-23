/*
  # Create users table for user profiles

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, user email)
      - `role` (text, user role)
      - `phone` (text, phone number)
      - `name` (text, full name)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to read their own data
    - Add policies for authenticated users to read all user data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  phone text DEFAULT '',
  name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to read all user data (for role-based access)
CREATE POLICY "Authenticated users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow system to insert new user profiles
CREATE POLICY "Allow insert for new users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);