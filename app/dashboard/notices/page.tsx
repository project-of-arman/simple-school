'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getNotices } from '@/lib/supabase';
import { Notice } from '@/types';
import CreateNoticeDialog from '@/components/dashboard/create-notice-dialog';
import UpdateNoticeDialog from '@/components/dashboard/update-notice-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link'
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Bell, 
  Search, 
  Edit, 
  Eye, 
  Filter,
  Calendar,
  AlertTriangle,
  Users,
  Megaphone
} from 'lucide-react';
import { format } from 'date-fns';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();

  const noticesPerPage = 10;

  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchTerm]);

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

  const handleNoticeCreated = () => {
    fetchNotices(); // Refresh the notices list
  };

  const handleNoticeUpdated = () => {
    fetchNotices(); // Refresh the notices list
  };

  const openUpdateDialog = (notice: Notice) => {
    setSelectedNotice(notice);
    setUpdateDialogOpen(true);
  };

  const totalPages = Math.ceil(totalCount / noticesPerPage);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Please login to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('dashboard.notices')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-orange-600" />
                {t('dashboard.notices')}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage school announcements and notices
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <CreateNoticeDialog onNoticeCreated={handleNoticeCreated} />
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notices by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notices ({totalCount} total)</span>
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
                  <div key={notice.id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
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
                        <p className="text-gray-600 line-clamp-2 mb-4">
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
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/notices/${notice.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openUpdateDialog(notice)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Notice Dialog */}
        {selectedNotice && (
          <UpdateNoticeDialog
            notice={selectedNotice}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            onNoticeUpdated={handleNoticeUpdated}
          />
        )}
      </div>
    </>
  );
}