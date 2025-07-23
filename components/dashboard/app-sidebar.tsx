'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Bell,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  LogOut, 
  School,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, signOut } = useAuth();
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
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-600 text-sidebar-primary-foreground">
                  <School className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">School Management</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">
                Signed in as: {user?.email}
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Role: {userRole}
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}