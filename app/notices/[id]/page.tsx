'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Notice } from '@/types';
import Navbar from '@/components/ui/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  AlertTriangle, 
  Users, 
  Megaphone,
  Download,
  FileText,
  Eye
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

export default function SingleNoticePage() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const noticeId = params.id as string;

  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', noticeId)
        .single();
      
      if (error) {
        setError('Notice not found');
        return;
      }
      
      if (data) {
        setNotice(data);
      }
    } catch (error) {
      console.error('Error fetching notice:', error);
      setError('Failed to load notice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (notice?.attachment_url) {
      try {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = notice.attachment_url;
        link.download = `notice-${notice.id}-attachment.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Notice Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The notice you are looking for does not exist.'}</p>
            <Link href="/notices">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notices
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/notices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notices
            </Button>
          </Link>
        </div>

        {/* Notice Content */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {notice.title}
                  </CardTitle>
                  {notice.is_marquee && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <Megaphone className="w-5 h-5" />
                      <span className="text-sm font-medium">MARQUEE</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(notice.published_at), 'MMMM dd, yyyy')}</span>
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
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Notice Content */}
            <div className="prose max-w-none mb-8">
              <div 
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            </div>

            {/* Attachment Section */}
            {notice.attachment_url && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Attachment
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Notice Attachment</p>
                        <p className="text-sm text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(notice.attachment_url, '_blank')}
                        className="flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={handleDownload}
                        size="sm"
                        className="flex items-center bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notice Metadata */}
            <div className="border-t pt-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notice Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Notice ID:</span>
                      <span className="font-mono text-xs">{notice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span>{format(new Date(notice.published_at), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <Badge 
                        variant="outline" 
                        className={`${priorityColors[notice.priority]} text-xs`}
                      >
                        {t(`priority.${notice.priority}`)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Audience:</span>
                      <Badge 
                        variant="outline" 
                        className={`${audienceColors[notice.target_audience]} text-xs`}
                      >
                        {notice.target_audience === 'all' ? 'All' : notice.target_audience}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Marquee Display:</span>
                      <span className={notice.is_marquee ? 'text-green-600' : 'text-gray-500'}>
                        {notice.is_marquee ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <Link href="/notices">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Notices
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}