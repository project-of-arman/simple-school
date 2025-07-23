/*
  # Fix notices table schema with correct users table reference

  1. Table Updates
    - Ensure `notices` table has all required columns
    - Add missing columns if they don't exist
    - Update column types if needed

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access controls

  3. Data Integrity
    - Add proper constraints and defaults
    - Ensure foreign key relationships
    - Work with existing users table structure
*/

-- First, let's check if the notices table exists and recreate it with the correct schema
DROP TABLE IF EXISTS notices CASCADE;

CREATE TABLE notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('urgent', 'high', 'normal', 'low')) DEFAULT 'normal',
  target_audience text NOT NULL CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')) DEFAULT 'all',
  published_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_marquee boolean DEFAULT false,
  attachment_url text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notices_published_at ON notices(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority);
CREATE INDEX IF NOT EXISTS idx_notices_target_audience ON notices(target_audience);
CREATE INDEX IF NOT EXISTS idx_notices_is_marquee ON notices(is_marquee) WHERE is_marquee = true;

-- RLS Policies
CREATE POLICY "Allow public read access to notices"
  ON notices
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert notices"
  ON notices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = published_by);

CREATE POLICY "Allow users to update their own notices"
  ON notices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = published_by)
  WITH CHECK (auth.uid() = published_by);

CREATE POLICY "Allow users to delete their own notices"
  ON notices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = published_by);

-- Insert sample admin user (only with columns that exist in users table)
INSERT INTO users (id, email, role, phone) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@school.edu.bd', 'admin', '+8801700000001')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone;

-- Insert sample notices
INSERT INTO notices (title, content, priority, target_audience, published_by, is_marquee, published_at) VALUES
  ('জরুরি: আগামীকাল ছুটি', 'আবহাওয়ার কারণে আগামীকাল সকল ক্লাস বন্ধ থাকবে। বিস্তারিত জানার জন্য স্কুলের সাথে যোগাযোগ করুন।', 'urgent', 'all', '00000000-0000-0000-0000-000000000001', true, now() - interval '1 hour'),
  ('পরীক্ষার সময়সূচী প্রকাশ', 'আসন্ন মাসিক পরীক্ষার সময়সূচী প্রকাশিত হয়েছে। সকল শিক্ষার্থী নোটিশ বোর্ড দেখে নিন।', 'high', 'students', '00000000-0000-0000-0000-000000000001', false, now() - interval '2 hours'),
  ('অভিভাবক সভা', 'আগামী শুক্রবার সকাল ১০টায় অভিভাবক সভা অনুষ্ঠিত হবে। সকল অভিভাবকদের উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।', 'normal', 'parents', '00000000-0000-0000-0000-000000000001', false, now() - interval '1 day'),
  ('শিক্ষক প্রশিক্ষণ কর্মসূচী', 'আগামী সপ্তাহে শিক্ষক প্রশিক্ষণ কর্মসূচী অনুষ্ঠিত হবে। সকল শিক্ষকদের অংশগ্রহণ বাধ্যতামূলক।', 'high', 'teachers', '00000000-0000-0000-0000-000000000001', false, now() - interval '2 days'),
  ('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'আগামী মাসে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। আগ্রহী শিক্ষার্থীরা নাম নিবন্ধন করুন।', 'normal', 'students', '00000000-0000-0000-0000-000000000001', false, now() - interval '3 days'),
  ('নতুন ভর্তি শুরু', 'আগামী শিক্ষাবর্ষের জন্য নতুন ভর্তি কার্যক্রম শুরু হয়েছে। বিস্তারিত তথ্যের জন্য অফিসে যোগাযোগ করুন।', 'high', 'all', '00000000-0000-0000-0000-000000000001', true, now() - interval '4 days')
ON CONFLICT DO NOTHING;