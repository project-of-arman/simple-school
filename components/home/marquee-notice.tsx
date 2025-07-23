'use client';

import { useEffect, useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getMarqueeNotices } from '@/lib/supabase';
import { Notice } from '@/types';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MarqueeNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const marqueeRef = useRef<HTMLMarqueeElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchNotices() {
      const data = await getMarqueeNotices();
      setNotices(data || []);
      setLoading(false);
    }
    fetchNotices();
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const handleMouseOver = () => marquee.stop();
    const handleMouseOut = () => marquee.start();

    marquee.addEventListener('mouseover', handleMouseOver);
    marquee.addEventListener('mouseout', handleMouseOut);

    return () => {
      marquee.removeEventListener('mouseover', handleMouseOver);
      marquee.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (loading || notices.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-600 mx-4 rounded-full text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center rounded-full ml-3 space-x-2 px-4 bg-red-700 py-2">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm whitespace-nowrap">
            {t('priority.urgent')}
          </span>
        </div>
        <div className="flex-1">
          <marquee
            ref={marqueeRef as any}
            direction="left"
            scrollAmount={6}
            className="text-sm font-medium whitespace-nowrap hover:[animation-play-state:paused] px-4"
          >
            {notices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`} className="mx-4 hover:underline">
                {notice.title}
              </Link>
            ))}
          </marquee>
        </div>
      </div>
    </div>
  );
}
