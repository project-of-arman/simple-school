export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  institution_id: string;
  created_at: string;
}

export interface Student {
  id: string;
  name_bangla: string;
  name_english: string;
  birth_certificate_no: string;
  blood_group: string;
  class_id: string;
  section_id: string;
  admission_date: string;
  student_id: string;
  father_name: string;
  mother_name: string;
  address: string;
  phone: string;
  photo_url?: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  name_bangla: string;
  name_english: string;
  designation: string;
  qualification: string;
  subject_specialization: string;
  joining_date: string;
  employee_id: string;
  phone: string;
  email: string;
  address: string;
  photo_url?: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  numeric_value: number;
  class_type: 'primary' | 'secondary' | 'higher_secondary';
  created_at: string;
}

export interface Section {
  id: string;
  class_id: string;
  section_name: string;
  teacher_id: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  target_audience: 'all' | 'students' | 'teachers' | 'parents';
  published_by: string;
  is_marquee: boolean;
  published_at: string;
  created_at: string;
}

export interface FormType {
  id: string;
  name_english: string;
  name_bangla: string;
  description: string;
  form_fields: any;
  is_active: boolean;
  created_at: string;
}

export interface FormSubmission {
  id: string;
  form_type_id: string;
  user_id: string;
  form_data: any;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  submitted_at: string;
  processed_at?: string;
  processed_by?: string;
  remarks?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  created_at: string;
}

export interface Language {
  code: 'en' | 'bn';
  name: string;
  flag: string;
}