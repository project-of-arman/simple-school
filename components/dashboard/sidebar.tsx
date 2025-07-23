'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Bell, 
  FileText, 
  Calendar,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const { userRole, signOut } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard.overview'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.students'), href: '/dashboard/students', icon: GraduationCap },
    { name: t('dashboard.teachers'), href: '/dashboard/teachers', icon: Users },
    { name: t('dashboard.notices'), href: '/dashboard/notices', icon: Bell },
    { name: t('dashboard.forms'), href: '/dashboard/forms', icon: FileText },
    { name: t('dashboard.attendance'), href: '/dashboard/attendance', icon: Calendar },
    { name: t('dashboard.reports'), href: '/dashboard/reports', icon: BarChart3 },
    { name: t('dashboard.settings'), href: '/dashboard/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-1 flex-col pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SM</span>
          </div>
          <h2 className="ml-3 text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <nav className="mt-2 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );
}