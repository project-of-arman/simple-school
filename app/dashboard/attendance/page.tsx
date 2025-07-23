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
  Calendar, 
  Search, 
  Plus, 
  Filter,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload
} from 'lucide-react';

// Mock attendance data
const mockAttendanceData = [
  {
    id: '1',
    student_name: 'আহমেদ রাফি',
    student_name_en: 'Ahmed Rafi',
    student_id: 'STD001',
    class: 'Class 5',
    section: 'A',
    date: '2024-01-15',
    status: 'present',
    marked_by: 'Teacher A'
  },
  {
    id: '2',
    student_name: 'ফাতিমা খাতুন',
    student_name_en: 'Fatima Khatun',
    student_id: 'STD002',
    class: 'Class 5',
    section: 'A',
    date: '2024-01-15',
    status: 'absent',
    marked_by: 'Teacher A'
  },
  {
    id: '3',
    student_name: 'মোহাম্মদ হাসান',
    student_name_en: 'Mohammad Hasan',
    student_id: 'STD003',
    class: 'Class 6',
    section: 'B',
    date: '2024-01-15',
    status: 'late',
    marked_by: 'Teacher B'
  },
  {
    id: '4',
    student_name: 'আয়েশা সিদ্দিকা',
    student_name_en: 'Ayesha Siddika',
    student_id: 'STD004',
    class: 'Class 7',
    section: 'A',
    date: '2024-01-15',
    status: 'present',
    marked_by: 'Teacher C'
  }
];

const statusColors = {
  present: 'bg-green-100 text-green-800 border-green-200',
  absent: 'bg-red-100 text-red-800 border-red-200',
  late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const statusIcons = {
  present: CheckCircle,
  absent: XCircle,
  late: Clock,
};

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalStudents = attendanceData.filter(r => r.date === selectedDate).length;
  const presentCount = attendanceData.filter(r => r.date === selectedDate && r.status === 'present').length;
  const absentCount = attendanceData.filter(r => r.date === selectedDate && r.status === 'absent').length;
  const lateCount = attendanceData.filter(r => r.date === selectedDate && r.status === 'late').length;

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
                  <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                  {t('dashboard.attendance')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage student attendance
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Mark Attendance
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
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
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
                      placeholder="Search by student name, ID, or class..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'present' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('present')}
                  >
                    Present
                  </Button>
                  <Button
                    variant={statusFilter === 'absent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('absent')}
                  >
                    Absent
                  </Button>
                  <Button
                    variant={statusFilter === 'late' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('late')}
                  >
                    Late
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Records ({filteredAttendance.length})</span>
                <Badge variant="secondary">
                  {new Date(selectedDate).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance.map((record) => {
                  const StatusIcon = statusIcons[record.status as keyof typeof statusIcons];
                  return (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(language === 'bn' ? record.student_name : record.student_name_en).charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {language === 'bn' ? record.student_name : record.student_name_en}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {record.student_id}</span>
                            <span>{record.class} - {record.section}</span>
                            <span>Marked by: {record.marked_by}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={statusColors[record.status as keyof typeof statusColors]}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {t(`common.${record.status}`)}
                      </Badge>
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