'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: Clock,
  processing: AlertCircle,
  approved: CheckCircle,
  rejected: XCircle,
};

// Mock data for form submissions
const mockFormSubmissions = [
  {
    id: '1',
    form_type: 'Admission Application',
    form_type_bn: 'ভর্তির আবেদন',
    applicant_name: 'আহমেদ রাফি',
    applicant_name_en: 'Ahmed Rafi',
    status: 'pending',
    submitted_at: '2024-01-15T10:30:00Z',
    form_data: {
      student_name: 'Ahmed Rafi',
      father_name: 'Mohammad Karim',
      class_applying: 'Class 6'
    }
  },
  {
    id: '2',
    form_type: 'Transfer Certificate',
    form_type_bn: 'স্থানান্তর সনদ',
    applicant_name: 'ফাতিমা খাতুন',
    applicant_name_en: 'Fatima Khatun',
    status: 'approved',
    submitted_at: '2024-01-14T14:20:00Z',
    form_data: {
      student_name: 'Fatima Khatun',
      current_class: 'Class 8',
      reason: 'Family relocation'
    }
  },
  {
    id: '3',
    form_type: 'Scholarship Application',
    form_type_bn: 'বৃত্তির আবেদন',
    applicant_name: 'মোহাম্মদ হাসান',
    applicant_name_en: 'Mohammad Hasan',
    status: 'processing',
    submitted_at: '2024-01-13T09:15:00Z',
    form_data: {
      student_name: 'Mohammad Hasan',
      class: 'Class 9',
      gpa: '5.00'
    }
  },
  {
    id: '4',
    form_type: 'Testimonial Request',
    form_type_bn: 'প্রশংসাপত্রের আবেদন',
    applicant_name: 'আয়েশা সিদ্দিকা',
    applicant_name_en: 'Ayesha Siddika',
    status: 'rejected',
    submitted_at: '2024-01-12T16:45:00Z',
    form_data: {
      student_name: 'Ayesha Siddika',
      graduation_year: '2023',
      purpose: 'Job application'
    }
  }
];

export default function FormsPage() {
  const [formSubmissions, setFormSubmissions] = useState(mockFormSubmissions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();

  const filteredSubmissions = formSubmissions.filter(submission => {
    const matchesSearch = submission.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.form_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-8 h-8 mr-3 text-purple-600" />
                  {t('dashboard.forms')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage form submissions and applications
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Forms</p>
                    <p className="text-2xl font-bold text-gray-900">{formSubmissions.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formSubmissions.filter(f => f.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formSubmissions.filter(f => f.status === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formSubmissions.filter(f => f.status === 'processing').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by applicant name or form type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'processing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('processing')}
                  >
                    Processing
                  </Button>
                  <Button
                    variant={statusFilter === 'approved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('approved')}
                  >
                    Approved
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Form Submissions ({filteredSubmissions.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon = statusIcons[submission.status as keyof typeof statusIcons];
                  return (
                    <div key={submission.id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {language === 'bn' ? submission.form_type_bn : submission.form_type}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={statusColors[submission.status as keyof typeof statusColors]}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {t(`status.${submission.status}`)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{language === 'bn' ? submission.applicant_name : submission.applicant_name_en}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>Form ID: {submission.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}