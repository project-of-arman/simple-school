'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone } from 'lucide-react';
import { getTeachers } from '@/lib/supabase';
import { Teacher } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherProfiles() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await getTeachers(6, 0);
        if (!error && data) {
          setTeachers(data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>{t('home.teachers.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-600" />
          <span>{t('home.teachers.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="group">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {(language === 'bn' ? teacher.name_bangla : teacher.name_english).charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {language === 'bn' ? teacher.name_bangla : teacher.name_english}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{teacher.designation}</p>
                  <p className="text-xs text-blue-600 mb-3">{teacher.subject_specialization}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{teacher.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}