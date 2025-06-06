'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Users,
  LogOut,
  LayoutGrid,
  CircleGauge,
  FileChartColumn,
  ScanText,
  Settings,
} from 'lucide-react';
import { useEffect } from 'react';

import { Branding } from '@/components/branding';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRoute } from '@/stores/use-route-store';
import { useAuth } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/use-ui-store';
import { useTranslations } from 'next-intl';

export function SheetNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeRoute, setActiveRoute } = useRoute();
  const { user, signOut } = useAuth();
  const { isSheetOpen, setSheetOpen } = useUIStore();

  // Get username and role from auth store
  const username = user?.username || 'uid';
  const userRole = user?.role || 'student';

  // Use "admin" as path for admin users, username for students
  const userPath = userRole === 'admin' ? 'admin' : username;

  // Define navigation items based on user role
  const t = useTranslations('DashboardNav');
  const navItems = [
    {
      href: `/dashboard/${userPath}`,
      label: 'dashboard',
      icon: <LayoutGrid className="h-5 w-5" />,
      roles: ['student', 'admin'],
    },
    {
      href: '/scan',
      label: 'startScan',
      icon: <CircleGauge className="h-5 w-5" />,
      roles: ['student'], // Removed admin access
      target: '_blank',
    },
    {
      href: `/dashboard/${userPath}/results`,
      label: 'scanResults',
      icon: <FileChartColumn className="h-5 w-5" />,
      roles: ['student'], // Removed admin access
    },
    {
      href: '/dashboard/admin/reports',
      label: 'scanReports',
      icon: <ScanText className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: '/dashboard/admin/users',
      label: 'users',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      href: `/dashboard/${userPath}/settings`,
      label: 'settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['student'], // Removed admin access
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(); // This already updates lastActive through the useAuth store
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname, setActiveRoute]);

  const linkClass = (href: string) => {
    if (href === '/scan') {
      return 'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground';
    }

    return `mx-[-0.65rem] flex items-center gap-4 rounded-xl ${
      activeRoute === href ? 'bg-muted px-3 py-2 text-primary' : 'px-3 py-2 text-muted-foreground'
    }`;
  };

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="grid gap-2 text-lg font-medium">
          <Branding />
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={linkClass(item.href)}
                target={item.target}
                onClick={handleLinkClick}
              >
                {item.icon}
                {t(item.label)}
              </Link>
            ))}
        </nav>
        <div className="mt-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2 text-destructive"
            onClick={handleSignOut}
            title="Sign out of your account"
          >
            <LogOut className="h-5 w-5 text-destructive" />
            {t('signOut')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
