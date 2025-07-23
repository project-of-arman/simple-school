'use client';

import { ExternalLink, FileText, Users, GraduationCap, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const linkCategories = [
  {
    title: { en: 'Government Services', bn: 'সরকারি সেবাসমূহ' },
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    links: [
      { name: { en: 'Online/Offline', bn: 'অনলাইন/অফলাইন' }, url: '#' },
      { name: { en: 'Certificate', bn: 'সার্টিফিকেট' }, url: '#' },
      { name: { en: 'Other Services', bn: 'অন্যান্য সেবা' }, url: '#' },
      { name: { en: 'Verification', bn: 'যাচাইকরণ' }, url: '#' }
    ]
  },
  {
    title: { en: 'Name & Class Information Service', bn: 'নাম ও ক্লাস সংশোধন সেবাসমূহ' },
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    links: [
      { name: { en: 'Name & Class Correction Form', bn: 'নাম ও ক্লাস সংশোধনের ফর্ম' }, url: '#' },
      { name: { en: 'Name Correction Application', bn: 'নাম সংশোধনের আবেদন' }, url: '#' },
      { name: { en: 'Class Correction Application', bn: 'ক্লাস সংশোধনের আবেদন' }, url: '#' },
      { name: { en: 'Application Guidelines', bn: 'আবেদনের নির্দেশাবলী' }, url: '#' }
    ]
  },
  {
    title: { en: 'Academic Services', bn: 'প্রাতিষ্ঠানিক সেবাসমূহ' },
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    links: [
      { name: { en: 'Admission Application', bn: 'ভর্তির আবেদন' }, url: '#' },
      { name: { en: 'Name & Class Correction', bn: 'নাম ও ক্লাস সংশোধন' }, url: '#' },
      { name: { en: 'Transfer Certificate', bn: 'ট্রান্সফার সার্টিফিকেট' }, url: '#' },
      { name: { en: 'Result Inquiry', bn: 'ফলাফল অনুসন্ধান' }, url: '#' }
    ]
  },
  {
    title: { en: 'Exam Services', bn: 'পরীক্ষা সংক্রান্ত সেবা' },
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    links: [
      { name: { en: 'JSC Exam', bn: 'জেএসসি পরীক্ষা' }, url: '#' },
      { name: { en: 'SSC Exam', bn: 'এসএসসি পরীক্ষা' }, url: '#' },
      { name: { en: 'HSC Exam', bn: 'এইচএসসি পরীক্ষা' }, url: '#' },
      { name: { en: 'Exam Guidelines', bn: 'পরীক্ষার নির্দেশনা' }, url: '#' }
    ]
  }
];

export default function ImportantLinks() {
  const { language, t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <span>{language === 'bn' ? 'গুরুত্বপূর্ণ লিংকসমূহ' : 'Important Links'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {linkCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-3">
                      {category.title[language]}
                    </h3>
                    <ul className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a 
                            href={link.url}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                          >
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            <span>{link.name[language]}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}