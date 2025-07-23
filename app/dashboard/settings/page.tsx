'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  School,
  Bell,
  Users,
  Shield,
  Database,
  Mail,
  Globe,
  Palette,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Dhaka Model School',
    name_bn: 'ঢাকা মডেল স্কুল',
    address: '123 School Street, Dhaka, Bangladesh',
    phone: '+880-2-123456789',
    email: 'info@dhakamodelschool.edu.bd',
    website: 'www.dhakamodelschool.edu.bd',
    established: '1995',
    motto: 'Excellence in Education',
    motto_bn: 'শিক্ষায় উৎকর্ষতা'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    gradeUpdates: true,
    feeReminders: true
  });

  const [systemSettings, setSystemSettings] = useState({
    defaultLanguage: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    academicYear: '2024-2025',
    autoBackup: true,
    maintenanceMode: false
  });

  const { user, userRole } = useAuth();
  const { language, t } = useLanguage();

  const handleSchoolSettingsChange = (field: string, value: string) => {
    setSchoolSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotificationSettings(prev => ({ 
      ...prev, 
      [field]: !prev[field as keyof typeof prev] 
    }));
  };

  const handleSystemSettingsChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

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
                  <Settings className="w-8 h-8 mr-3 text-gray-600" />
                  {t('dashboard.settings')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure system settings and preferences
                </p>
              </div>
              <Button className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="w-5 h-5 mr-2 text-blue-600" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolName">School Name (English)</Label>
                    <Input
                      id="schoolName"
                      value={schoolSettings.name}
                      onChange={(e) => handleSchoolSettingsChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schoolNameBn">School Name (Bengali)</Label>
                    <Input
                      id="schoolNameBn"
                      value={schoolSettings.name_bn}
                      onChange={(e) => handleSchoolSettingsChange('name_bn', e.target.value)}
                      className="bangla-text"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={schoolSettings.address}
                    onChange={(e) => handleSchoolSettingsChange('address', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={schoolSettings.phone}
                      onChange={(e) => handleSchoolSettingsChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={schoolSettings.email}
                      onChange={(e) => handleSchoolSettingsChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={schoolSettings.website}
                      onChange={(e) => handleSchoolSettingsChange('website', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="established">Established Year</Label>
                    <Input
                      id="established"
                      value={schoolSettings.established}
                      onChange={(e) => handleSchoolSettingsChange('established', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motto">School Motto (English)</Label>
                    <Input
                      id="motto"
                      value={schoolSettings.motto}
                      onChange={(e) => handleSchoolSettingsChange('motto', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mottoBn">School Motto (Bengali)</Label>
                    <Input
                      id="mottoBn"
                      value={schoolSettings.motto_bn}
                      onChange={(e) => handleSchoolSettingsChange('motto_bn', e.target.value)}
                      className="bangla-text"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-600" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                      <p className="text-sm text-gray-600">Get alerts for attendance issues</p>
                    </div>
                    <Switch
                      id="attendanceAlerts"
                      checked={notificationSettings.attendanceAlerts}
                      onCheckedChange={() => handleNotificationToggle('attendanceAlerts')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="gradeUpdates">Grade Updates</Label>
                      <p className="text-sm text-gray-600">Notifications for grade changes</p>
                    </div>
                    <Switch
                      id="gradeUpdates"
                      checked={notificationSettings.gradeUpdates}
                      onCheckedChange={() => handleNotificationToggle('gradeUpdates')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="feeReminders">Fee Reminders</Label>
                      <p className="text-sm text-gray-600">Automatic fee payment reminders</p>
                    </div>
                    <Switch
                      id="feeReminders"
                      checked={notificationSettings.feeReminders}
                      onCheckedChange={() => handleNotificationToggle('feeReminders')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-purple-600" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <select
                      id="defaultLanguage"
                      value={systemSettings.defaultLanguage}
                      onChange={(e) => handleSystemSettingsChange('defaultLanguage', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="bn">Bengali</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      value={systemSettings.dateFormat}
                      onChange={(e) => handleSystemSettingsChange('dateFormat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <select
                      id="timeFormat"
                      value={systemSettings.timeFormat}
                      onChange={(e) => handleSystemSettingsChange('timeFormat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={systemSettings.academicYear}
                      onChange={(e) => handleSystemSettingsChange('academicYear', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Automatic Backup</Label>
                      <p className="text-sm text-gray-600">Enable daily automatic backups</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleSystemSettingsChange('autoBackup', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable maintenance mode</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleSystemSettingsChange('maintenanceMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Role Permissions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Admin Users:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teachers:</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="font-medium">1,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parents:</span>
                        <span className="font-medium">980</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Manage User Roles
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Bulk Email Users
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Export User Data
                    </Button>
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