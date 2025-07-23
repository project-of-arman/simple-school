'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.academics': 'Academics',
    'nav.admissions': 'Admissions',
    'nav.notices': 'Notices',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Home Page
    'home.welcome': 'Welcome to Our School',
    'home.hero.title': 'Excellence in Education',
    'home.hero.subtitle': 'Nurturing minds, building futures',
    'home.notices.title': 'Latest Notices',
    'home.teachers.title': 'Our Teachers',
    'home.students.title': 'Student Achievements',
    'home.gallery.title': 'Photo Gallery',

    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.students': 'Students',
    'dashboard.teachers': 'Teachers',
    'dashboard.notices': 'Notices',
    'dashboard.forms': 'Forms',
    'dashboard.attendance': 'Attendance',
    'dashboard.reports': 'Reports',
    'dashboard.settings': 'Settings',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.total': 'Total',
    'common.present': 'Present',
    'common.absent': 'Absent',

    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.address': 'Address',
    'form.submit': 'Submit',
    'form.required': 'Required',

    // Status
    'status.pending': 'Pending',
    'status.processing': 'Processing',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',

    // Priority
    'priority.urgent': 'Urgent',
    'priority.high': 'High',
    'priority.normal': 'Normal',
    'priority.low': 'Low',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.about': 'সম্পর্কে',
    'nav.academics': 'শিক্ষাবিষয়ক',
    'nav.admissions': 'ভর্তি',
    'nav.notices': 'নোটিশ',
    'nav.gallery': 'গ্যালারি',
    'nav.contact': 'যোগাযোগ',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.login': 'লগইন',
    'nav.logout': 'লগআউট',

    // Home Page
    'home.welcome': 'আমাদের স্কুলে স্বাগতম',
    'home.hero.title': 'শিক্ষায় উৎকর্ষতা',
    'home.hero.subtitle': 'মন গড়ি, ভবিষ্যৎ গড়ি',
    'home.notices.title': 'সর্বশেষ নোটিশ',
    'home.teachers.title': 'আমাদের শিক্ষকবৃন্দ',
    'home.students.title': 'শিক্ষার্থীদের অর্জন',
    'home.gallery.title': 'ছবির গ্যালারি',

    // Dashboard
    'dashboard.overview': 'সারসংক্ষেপ',
    'dashboard.students': 'শিক্ষার্থী',
    'dashboard.teachers': 'শিক্ষক',
    'dashboard.notices': 'নোটিশ',
    'dashboard.forms': 'ফর্ম',
    'dashboard.attendance': 'উপস্থিতি',
    'dashboard.reports': 'রিপোর্ট',
    'dashboard.settings': 'সেটিংস',

    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'একটি ত্রুটি ঘটেছে',
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.delete': 'মুছুন',
    'common.edit': 'সম্পাদনা',
    'common.view': 'দেখুন',
    'common.add': 'যোগ করুন',
    'common.search': 'খুঁজুন',
    'common.filter': 'ফিল্টার',
    'common.total': 'মোট',
    'common.present': 'উপস্থিত',
    'common.absent': 'অনুপস্থিত',

    // Forms
    'form.name': 'নাম',
    'form.email': 'ইমেইল',
    'form.phone': 'ফোন',
    'form.address': 'ঠিকানা',
    'form.submit': 'জমা দিন',
    'form.required': 'আবশ্যক',

    // Status
    'status.pending': 'অপেক্ষমান',
    'status.processing': 'প্রক্রিয়াধীন',
    'status.approved': 'অনুমোদিত',
    'status.rejected': 'প্রত্যাখ্যাত',

    // Priority
    'priority.urgent': 'জরুরি',
    'priority.high': 'উচ্চ',
    'priority.normal': 'সাধারণ',
    'priority.low': 'নিম্ন',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLang(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};