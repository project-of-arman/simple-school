/*
  # Fix date casting error in students table

  1. Changes
    - Fix the admission_date column casting issue by properly casting text to date
    - Ensure all date values are properly formatted

  2. Security
    - No changes to existing RLS policies
*/

-- Fix the students data insertion with proper date casting
INSERT INTO students (name_bangla, name_english, birth_certificate_no, blood_group, class_id, section_id, admission_date, student_id, father_name, mother_name, address, phone) 
SELECT 
  student_data.name_bangla,
  student_data.name_english,
  student_data.birth_certificate_no,
  student_data.blood_group,
  c.id as class_id,
  s.id as section_id,
  student_data.admission_date::date,  -- Explicit cast to date
  student_data.student_id,
  student_data.father_name,
  student_data.mother_name,
  student_data.address,
  student_data.phone
FROM (VALUES 
  ('আহমেদ রাফি', 'Ahmed Rafi', 'BC001234567890', 'A+', 'Class 5', 'A', '2020-01-15', 'STD001', 'মোহাম্মদ করিম', 'রাশিদা বেগম', 'Dhaka, Bangladesh', '+8801712345001'),
  ('ফাতিমা তুজ জোহরা', 'Fatima Tuz Zohra', 'BC001234567891', 'B+', 'Class 5', 'A', '2020-01-20', 'STD002', 'আব্দুল রহমান', 'সালমা খাতুন', 'Dhaka, Bangladesh', '+8801712345002'),
  ('মোহাম্মদ হাসান', 'Mohammad Hasan', 'BC001234567892', 'O+', 'Class 6', 'B', '2019-02-10', 'STD003', 'আবুল কালাম', 'রোকেয়া বেগম', 'Dhaka, Bangladesh', '+8801712345003'),
  ('আয়েশা সিদ্দিকা', 'Ayesha Siddika', 'BC001234567893', 'AB+', 'Class 7', 'A', '2018-03-05', 'STD004', 'মোহাম্মদ আলী', 'নাসরিন আক্তার', 'Dhaka, Bangladesh', '+8801712345004'),
  ('রাফিউল ইসলাম', 'Rafiul Islam', 'BC001234567894', 'A-', 'Class 8', 'B', '2017-01-25', 'STD005', 'জাকির হোসেন', 'শাহনাজ পারভীন', 'Dhaka, Bangladesh', '+8801712345005'),
  ('তাসনিম জাহান', 'Tasnim Jahan', 'BC001234567895', 'B-', 'Class 9', 'A', '2016-04-12', 'STD006', 'ফারুক আহমেদ', 'রুমা খাতুন', 'Dhaka, Bangladesh', '+8801712345006')
) AS student_data(name_bangla, name_english, birth_certificate_no, blood_group, class_name, section_name, admission_date, student_id, father_name, mother_name, address, phone)
JOIN classes c ON c.name = student_data.class_name
JOIN sections s ON s.class_id = c.id AND s.section_name = student_data.section_name
ON CONFLICT (student_id) DO NOTHING;