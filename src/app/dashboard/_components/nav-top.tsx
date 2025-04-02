'use client';

import {
  Search,
  Users,
  LayoutGrid,
  CircleGauge,
  FileChartColumn,
  Settings,
  ScanText,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { SheetNav } from './nav-sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserDataStore } from '@/stores/use-user-data-store';

export function TopNav() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { userData, fetchUserData } = useUserDataStore();

  // Get username and role from auth store
  const username = user?.username || 'uid';
  const userRole = user?.role || 'student';

  // Use "admin" as path for admin users, username for students
  const userPath = userRole === 'admin' ? 'admin' : username;

  // Define navigation items based on user role
  const navItems = [
    {
      href: `/dashboard/${userPath}`,
      label: 'Dashboard',
      icon: <LayoutGrid className="h-4 w-4" />,
      roles: ['student', 'admin'],
    },
    {
      href: '/scan',
      label: 'Start Scan',
      icon: <CircleGauge className="h-4 w-4" />,
      roles: ['student'],
    },
    {
      href: `/dashboard/${userPath}/results`,
      label: 'Scan Results',
      icon: <FileChartColumn className="h-4 w-4" />,
      roles: ['student'],
    },
    {
      href: '/dashboard/admin/reports',
      label: 'Scan Reports',
      icon: <ScanText className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      href: '/dashboard/admin/users',
      label: 'Users',
      icon: <Users className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      href: `/dashboard/${userPath}/settings`,
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      roles: ['student'],
    },
  ];

  useEffect(() => {
    if (user?.uid) {
      fetchUserData(user.uid);
    }
  }, [user?.uid, fetchUserData]);

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <SheetNav />
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {userData && (
                <>
                  <AvatarImage
                    src={userData.photoURL}
                    alt={userData.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback>{getInitials(userData.fullName)}</AvatarFallback>
                </>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              {userData && (
                <>
                  <p className="text-sm font-medium leading-none">{userData.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                </>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => router.push(item.href)}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2"
            title="Sign out (your last activity will be recorded)"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
