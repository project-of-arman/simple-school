/*
  # Add attachment support to notices table

  1. Changes
    - Add attachment_url column to notices table for file attachments
    - This allows notices to have downloadable files attached

  2. Security
    - No changes to existing RLS policies
*/

-- Add attachment_url column to notices table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notices' AND column_name = 'attachment_url'
  ) THEN
    ALTER TABLE notices ADD COLUMN attachment_url text;
  END IF;
END $$;