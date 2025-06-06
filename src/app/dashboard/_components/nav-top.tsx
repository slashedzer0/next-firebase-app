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
  Languages,
  Check,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/use-auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/command';
import { SheetNav } from './nav-sheet';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserDataStore } from '@/stores/use-user-data-store';
import React from 'react';
import { setUserLocale } from '@/i18n/locale';
import { useLocaleStore } from '@/stores/use-locale-store';
import { useTranslations } from 'next-intl';

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocaleStore();
  // Sync locale from cookie on mount
  React.useEffect(() => {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith('NEXT_LOCALE='));
    if (cookie) {
      const value = cookie.split('=')[1];
      if (value === 'en' || value === 'id') setLocale(value);
    }
  }, [setLocale]);
  const { user, signOut } = useAuth();
  const { userData, fetchUserData } = useUserDataStore();
  const [open, setOpen] = useState(false);

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
      icon: <LayoutGrid className="h-4 w-4" />,
      roles: ['student', 'admin'],
    },
    {
      href: '/scan',
      label: 'startScan',
      icon: <CircleGauge className="h-4 w-4" />,
      roles: ['student'],
    },
    {
      href: `/dashboard/${userPath}/results`,
      label: 'scanResults',
      icon: <FileChartColumn className="h-4 w-4" />,
      roles: ['student'],
    },
    {
      href: '/dashboard/admin/reports',
      label: 'scanReports',
      icon: <ScanText className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      href: '/dashboard/admin/users',
      label: 'users',
      icon: <Users className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      href: `/dashboard/${userPath}/settings`,
      label: 'settings',
      icon: <Settings className="h-4 w-4" />,
      roles: ['student'],
    },
  ];

  useEffect(() => {
    if (user?.uid) {
      fetchUserData(user.uid);
    }
  }, [user?.uid, fetchUserData]);

  // Add keyboard shortcut listener for Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Get filtered navigation items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const [, startTransition] = useTransition();

  const handleLocaleChange = (locale: 'en' | 'id') => {
    startTransition(async () => {
      await setUserLocale(locale);
      router.replace(pathname); // trigger SSR re-render, next-intl akan baca cookie baru
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <SheetNav />
      <div className="w-full flex-1">
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground md:w-2/3 lg:w-1/3"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>{t('searchPlaceholder')}</span>
          <kbd className="pointer-events-none absolute right-2 top-[50%] hidden h-5 translate-y-[-50%] select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium opacity-100 sm:flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder={t('searchPlaceholder')} />
          <CommandList>
            <CommandEmpty>{t('noResults')}</CommandEmpty>
            <CommandGroup heading={t('navigation')}>
              {filteredNavItems.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  style={{ opacity: 1 }} // Force full opacity
                  className="opacity-100 font-medium" // Ensure visibility
                >
                  <div
                    className="mr-2 flex items-center justify-center opacity-100"
                    style={{ color: 'var(--foreground)', opacity: 1 }}
                  >
                    {React.cloneElement(item.icon, {
                      className: 'h-4 w-4 opacity-100',
                      style: { opacity: 1, color: 'currentColor' },
                    })}
                  </div>
                  <span className="opacity-100" style={{ color: 'var(--foreground)', opacity: 1 }}>
                    {t(item.label)}
                  </span>
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => {
                  handleSignOut();
                  setOpen(false);
                }}
                className="text-destructive opacity-100 font-medium"
                style={{ opacity: 1 }}
              >
                <LogOut className="mr-2 h-4 w-4 opacity-100" style={{ opacity: 1 }} />
                <span style={{ opacity: 1 }}>{t('signOut')}</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="relative h-8 w-8 rounded-full flex items-center justify-center"
          >
            <Languages className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end" forceMount>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async () => {
                await handleLocaleChange('en');
                setLocale('en');
              }}
              className={`flex items-center gap-2 ${locale === 'en' ? 'bg-secondary' : ''}`}
            >
              {locale === 'en' ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="inline-block w-4" />
              )}
              {t('english')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await handleLocaleChange('id');
                setLocale('id');
              }}
              className={`flex items-center gap-2 ${locale === 'id' ? 'bg-secondary' : ''}`}
            >
              {locale === 'id' ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="inline-block w-4" />
              )}
              {t('indonesian')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
                  {t(item.label)}
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="group flex items-center gap-2 text-destructive"
            title="Sign out of your account"
          >
            <LogOut className="h-4 w-4 text-destructive group-hover:text-white" />
            {t('signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
