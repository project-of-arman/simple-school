'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getNotices } from '@/lib/supabase';
import { Notice } from '@/types';
import Navbar from '@/components/ui/navbar';
import {Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User, AlertTriangle, Users, Megaphone, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  normal: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200',
};

const audienceColors = {
  all: 'bg-purple-100 text-purple-800',
  students: 'bg-blue-100 text-blue-800',
  teachers: 'bg-green-100 text-green-800',
  parents: 'bg-yellow-100 text-yellow-800',
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { t } = useLanguage();

  const noticesPerPage = 10;

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * noticesPerPage;
      const { data, error, count } = await getNotices(noticesPerPage, offset);
      
      if (!error && data) {
        setNotices(data);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / noticesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-orange-600" />
                {t('nav.notices')}
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with the latest announcements and important information
              </p>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Notices ({totalCount} total)</span>
              <Badge variant="secondary">{notices.length} showing</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <Link key={notice.id} href={`/notices/${notice.id}`}>
                    <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {notice.title}
                          </h3>
                          {notice.is_marquee && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <Megaphone className="w-4 h-4" />
                              <span className="text-xs font-medium">MARQUEE</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {notice.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(notice.published_at), 'MMM dd, yyyy')}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={priorityColors[notice.priority]}
                          >
                            {notice.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {t(`priority.${notice.priority}`)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={audienceColors[notice.target_audience]}
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {notice.target_audience === 'all' ? 'All' : notice.target_audience}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * noticesPerPage) + 1} to {Math.min(currentPage * noticesPerPage, totalCount)} of {totalCount} notices
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-sm rounded ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white' 
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}