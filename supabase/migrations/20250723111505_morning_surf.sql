/*
  # Create notices table

  1. New Tables
    - `notices`
      - `id` (uuid, primary key)
      - `title` (text, notice title)
      - `content` (text, notice content)
      - `priority` (text, priority level)
      - `target_audience` (text, who should see this)
      - `published_by` (uuid, foreign key to users)
      - `is_marquee` (boolean, show in marquee)
      - `published_at` (timestamp, when published)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notices` table
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  target_audience text NOT NULL CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')),
  published_by uuid NOT NULL REFERENCES users(id),
  is_marquee boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Allow public read access for notices
CREATE POLICY "Allow public read access to notices"
  ON notices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to manage notices
CREATE POLICY "Allow authenticated users to manage notices"
  ON notices
  FOR ALL
  TO authenticated
  USING (true);

-- Insert a default admin user first (this will be used for sample notices)
INSERT INTO users (id, email, role, phone) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@school.edu.bd', 'admin', '+8801700000001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notices
INSERT INTO notices (title, content, priority, target_audience, published_by, is_marquee, published_at) VALUES
  ('জরুরি: আগামীকাল ছুটি', 'আবহাওয়ার কারণে আগামীকাল সকল ক্লাস বন্ধ থাকবে। বিস্তারিত জানার জন্য স্কুলের সাথে যোগাযোগ করুন।', 'urgent', 'all', '00000000-0000-0000-0000-000000000001', true, now() - interval '1 hour'),
  ('পরীক্ষার সময়সূচী প্রকাশ', 'আসন্ন মাসিক পরীক্ষার সময়সূচী প্রকাশিত হয়েছে। সকল শিক্ষার্থী নোটিশ বোর্ড দেখে নিন।', 'high', 'students', '00000000-0000-0000-0000-000000000001', false, now() - interval '2 hours'),
  ('অভিভাবক সভা', 'আগামী শুক্রবার সকাল ১০টায় অভিভাবক সভা অনুষ্ঠিত হবে। সকল অভিভাবকদের উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।', 'normal', 'parents', '00000000-0000-0000-0000-000000000001', false, now() - interval '1 day'),
  ('শিক্ষক প্রশিক্ষণ কর্মসূচী', 'আগামী সপ্তাহে শিক্ষক প্রশিক্ষণ কর্মসূচী অনুষ্ঠিত হবে। সকল শিক্ষকদের অংশগ্রহণ বাধ্যতামূলক।', 'high', 'teachers', '00000000-0000-0000-0000-000000000001', false, now() - interval '2 days'),
  ('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'আগামী মাসে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। আগ্রহী শিক্ষার্থীরা নাম নিবন্ধন করুন।', 'normal', 'students', '00000000-0000-0000-0000-000000000001', false, now() - interval '3 days'),
  ('নতুন ভর্তি শুরু', 'আগামী শিক্ষাবর্ষের জন্য নতুন ভর্তি কার্যক্রম শুরু হয়েছে। বিস্তারিত তথ্যের জন্য অফিসে যোগাযোগ করুন।', 'high', 'all', '00000000-0000-0000-0000-000000000001', true, now() - interval '4 days')
ON CONFLICT DO NOTHING;