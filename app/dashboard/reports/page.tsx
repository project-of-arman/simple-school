'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Calendar,
  Users,Pie,
  GraduationCap,
  TrendingUp,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

// Mock data for reports
const attendanceData = [
  { name: 'Mon', present: 850, absent: 50 },
  { name: 'Tue', present: 820, absent: 80 },
  { name: 'Wed', present: 880, absent: 20 },
  { name: 'Thu', present: 860, absent: 40 },
  { name: 'Fri', present: 890, absent: 10 },
  { name: 'Sat', present: 900, absent: 0 },
];

const classWiseData = [
  { class: 'Class 1', students: 120 },
  { class: 'Class 2', students: 115 },
  { class: 'Class 3', students: 110 },
  { class: 'Class 4', students: 105 },
  { class: 'Class 5', students: 100 },
  { class: 'Class 6', students: 95 },
];

const performanceData = [
  { name: 'A+', value: 25, color: '#10B981' },
  { name: 'A', value: 30, color: '#3B82F6' },
  { name: 'A-', value: 20, color: '#8B5CF6' },
  { name: 'B+', value: 15, color: '#F59E0B' },
  { name: 'B', value: 10, color: '#EF4444' },
];

const reportTypes = [
  {
    title: 'Attendance Report',
    title_bn: 'উপস্থিতির রিপোর্ট',
    description: 'Daily, weekly, and monthly attendance statistics',
    description_bn: 'দৈনিক, সাপ্তাহিক এবং মাসিক উপস্থিতির পরিসংখ্যান',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Academic Performance',
    title_bn: 'একাডেমিক পারফরম্যান্স',
    description: 'Student grades and performance analysis',
    description_bn: 'শিক্ষার্থীদের গ্রেড এবং পারফরম্যান্স বিশ্লেষণ',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Student Demographics',
    title_bn: 'শিক্ষার্থীদের তথ্য',
    description: 'Class-wise student distribution and statistics',
    description_bn: 'শ্রেণীভিত্তিক শিক্ষার্থী বিতরণ এবং পরিসংখ্যান',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Teacher Reports',
    title_bn: 'শিক্ষক রিপোর্ট',
    description: 'Teacher performance and activity reports',
    description_bn: 'শিক্ষকদের পারফরম্যান্স এবং কার্যকলাপের রিপোর্ট',
    icon: GraduationCap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Financial Reports',
    title_bn: 'আর্থিক রিপোর্ট',
    description: 'Fee collection and financial summaries',
    description_bn: 'ফি সংগ্রহ এবং আর্থিক সারসংক্ষেপ',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Custom Reports',
    title_bn: 'কাস্টম রিপোর্ট',
    description: 'Generate custom reports based on specific criteria',
    description_bn: 'নির্দিষ্ট মানদণ্ডের ভিত্তিতে কাস্টম রিপোর্ট তৈরি করুন',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();

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
                  <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
                  {t('dashboard.reports')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Generate and view comprehensive school reports
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
                <Button className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        <Icon className={`w-6 h-6 ${report.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {language === 'bn' ? report.title_bn : report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {language === 'bn' ? report.description_bn : report.description}
                        </p>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Weekly Attendance Trend</span>
                  <Badge variant="secondary">This Week</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Class-wise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Class-wise Student Distribution</span>
                  <Badge variant="secondary">Current Year</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grade Distribution */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {performanceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,250</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">Teachers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Classes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">98.5%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Monthly Attendance Rate</span>
                    <Badge variant="secondary">94.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Average Grade</span>
                    <Badge variant="secondary">A-</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Fee Collection Rate</span>
                    <Badge variant="secondary">96.8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}