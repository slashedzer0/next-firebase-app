'use client';

import React from 'react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { usePasswordVisibility } from '@/stores/use-password-visibility-store';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useTranslations } from 'next-intl';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const {
    signInWithEmail,
    signInWithGoogle,
    loading: { email: emailLoading, google: googleLoading },
    clearError,
    user,
  } = useAuth();
  const isPasswordVisible = usePasswordVisibility((state) => state.isVisible);
  const togglePasswordVisibility = usePasswordVisibility((state) => state.toggleVisibility);
  const t = useTranslations('AuthPage');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user?.username) {
      router.push(`/dashboard/${user.username}`);
    }
  }, [user?.username, router]);

  async function onSubmit(data: LoginFormData) {
    clearError();
    await signInWithEmail(data.email, data.password);
  }

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearError();
    await signInWithGoogle();
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('loginTitle')}</CardTitle>
          <CardDescription>
            {t('loginSubtitle')}{' '}
            <Link href="/signup" className="text-primary underline">
              {t('loginSignupLink')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign-in Button - OUTSIDE the form */}
          <div className="flex flex-col gap-4 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Image
                src="/google.svg"
                alt={t('loginWithGoogle')}
                width={20}
                height={20}
                className="inline-block mr-2"
              />
              {googleLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t('loginLoading')}
                </>
              ) : (
                t('loginWithGoogle')
              )}
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              {t('loginOrContinue')}
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 mt-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">{t('loginEmail')}</Label>
                      <FormControl>
                        <Input id="email" type="email" placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">{t('loginPassword')}</Label>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="password"
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder={isPasswordVisible ? 'password' : '••••••••'}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-foreground"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">{t('loginTogglePassword')}</span>
                        </Button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={emailLoading}>
                  {emailLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('loginLoading')}
                    </>
                  ) : (
                    t('loginButton')
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-primary  ">
        {t('loginTerms')} <a href="#">{t('loginTermsLink')}</a> and{' '}
        <a href="#">{t('loginPrivacyLink')}</a>.
      </div>
    </div>
  );
}
