'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getMarqueeNotices } from '@/lib/supabase';
import { Notice } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MarqueeNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await getMarqueeNotices();
        if (!error && data) {
          setNotices(data);
        }
      } catch (error) {
        console.error('Error fetching marquee notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading || notices.length === 0) {
    return null;
  }

  const noticeText = notices.map(notice => notice.title).join(' • ');

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 px-4 bg-red-700 py-2">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm whitespace-nowrap">
            {t('priority.urgent')}
          </span>
        </div>
        <div className="flex-1">
          <div className="animate-marquee whitespace-nowrap py-2 px-4">
            <span className="text-sm">{noticeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}