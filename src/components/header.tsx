'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Branding } from './branding';
import { useAuth } from '@/stores/use-auth-store';
import { useUIStore } from '@/stores/use-ui-store';

import { useTranslations } from 'next-intl';

const navigation = [
  { name: 'about', href: '/about' },
  { name: 'support', href: '/support' },
];

export function Header() {
  const t = useTranslations('Header');
  const { isMenuOpen, setMenuOpen } = useUIStore();
  const {
    user,
    loading: { initial },
  } = useAuth();

  // Generate dynamic dashboard path based on user role and username
  const getDashboardPath = () => {
    if (!user) return '/dashboard/uid';

    const username = user.username || 'uid';
    const userRole = user.role || 'student';

    // Use "admin" as path for admin users, username for students
    return `/dashboard/${userRole === 'admin' ? 'admin' : username}`;
  };

  // useBodyScrollLock - prevents body from scrolling when mobile menu is open
  useEffect(() => {
    // This is handled automatically by the useUIStore's setMenuOpen method
  }, []);

  return (
    <div>
      <header className="max-w-screen-2xl mx-auto px-4 py-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Branding />
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="flex md:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex md:items-center md:gap-x-6">
            {/* Navigation Menu */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-all hover:text-muted-foreground"
              >
                {t(item.name)}
              </Link>
            ))}

            {/* Separator */}
            <div className="hidden md:block h-5 w-px bg-foreground/30"></div>

            {/* Buttons */}
            {!initial && (
              <>
                {user ? (
                  <Link href={getDashboardPath()}>
                    <Button variant="outline" className="h-10">
                      {t('dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="h-10">
                      {t('login')}
                    </Button>
                  </Link>
                )}
              </>
            )}
            {/* Only show Check Your Score button for non-admin users */}
            {(!user || user.role !== 'admin') && (
              <Link href="/scan">
                <Button className="h-10">{t('checkScore')}</Button>
              </Link>
            )}
          </div>
        </nav>

        {/* mobile menu */}
        {isMenuOpen && (
          <div className="bg-white dark:bg-black absolute top-0 left-0 w-full h-full px-4 py-6 z-50 overflow-auto md:hidden lg:px-8">
            <div className="flex items-center justify-between">
              <Branding />
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="my-6">
              <div className="-my-6 divide-y">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block px-3 py-2 text-base font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t(item.name)}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {!initial && (
                    <>
                      {user ? (
                        <Link
                          href={getDashboardPath()}
                          className="-mx-3 block px-3 py-2.5 text-base font-semibold"
                          onClick={() => setMenuOpen(false)}
                        >
                          {t('dashboard')}
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="-mx-3 block px-3 py-2.5 text-base font-semibold"
                          onClick={() => setMenuOpen(false)}
                        >
                          {t('login')}
                        </Link>
                      )}
                    </>
                  )}
                  {/* Only show Check Your Score button for non-admin users */}
                  {(!user || user.role !== 'admin') && (
                    <Link
                      href="/scan"
                      className="-mx-3 block px-3 py-2.5 text-base font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t('checkScore')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
