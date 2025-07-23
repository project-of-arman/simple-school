import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  // If signup was successful, create a profile in the users table
  if (data.user && !error) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        role: userData.role,
        phone: userData.phone || '',
        name: userData.name || ''
      });
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't return this error to avoid confusing the user
      // The auth user was created successfully
    }
  }
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database helpers
export const getStudents = async (limit = 10, offset = 0) => {
  const { data, error, count } = await supabase
    .from('students')
    .select('*, classes(name), sections(section_name)', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  return { data, error, count };
};

export const getTeachers = async (limit = 10, offset = 0) => {
  const { data, error, count } = await supabase
    .from('teachers')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  return { data, error, count };
};

export const getNotices = async (limit = 10, offset = 0) => {
  const { data, error, count } = await supabase
    .from('notices')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('published_at', { ascending: false });
  
  return { data, error, count };
};

export const getMarqueeNotices = async () => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_marquee', true)
      .eq('priority', 'urgent')
      .order('published_at', { ascending: false })
      .limit(5);
  
    return { data, error };
  } catch (error) {
    console.error('Error fetching marquee notices:', error);
    return { data: [], error };
  }
};

export const getDashboardStats = async () => {
  const [studentsCount, teachersCount, noticesCount] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('teachers').select('*', { count: 'exact', head: true }),
    supabase.from('notices').select('*', { count: 'exact', head: true })
  ]);

  return {
    students: studentsCount.count || 0,
    teachers: teachersCount.count || 0,
    notices: noticesCount.count || 0,
  };
};