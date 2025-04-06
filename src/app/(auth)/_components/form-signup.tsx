'use client';

import Link from 'next/link';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/spinner';
import { usePasswordVisibility } from '@/stores/use-password-visibility-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/schemas/auth';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const {
    signUp,
    signInWithGoogle,
    loading: { email: emailLoading, google: googleLoading },
    clearError,
    user,
  } = useAuth();

  const isPasswordVisible = usePasswordVisibility((state) => state.isVisible);
  const togglePasswordVisibility = usePasswordVisibility((state) => state.toggleVisibility);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user?.username) {
      router.push(`/dashboard/${user.username}`);
    }
  }, [user?.username, router]);

  async function onSubmit(data: SignupFormData) {
    clearError();
    await signUp(data.name, data.email, data.password);
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
          <CardTitle className="text-xl">Join today</CardTitle>
          <CardDescription>
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline">
              Log in
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
                alt="Sign up with Google"
                width={20}
                height={20}
                className="inline-block mr-2"
              />
              {googleLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Signing up...
                </>
              ) : (
                'Sign up with Google'
              )}
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 mt-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Full name</Label>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email address</Label>
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
                      <Label htmlFor="password">Password</Label>
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
                          <span className="sr-only">Toggle password visibility</span>
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
                      Signing up...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
