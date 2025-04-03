'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsFormSchema, type SettingsFormValues } from '@/schemas/settings';
import { useAuth } from '@/stores/use-auth-store';
import { cn, handleError } from '@/utils';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function UserDashboardSettingsPage() {
  const { user, updateProfile, loading } = useAuth();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      nim: '',
      phone: '',
    },
    mode: 'onChange', // Enable live validation
  });

  // Live validation helper
  const getFieldStatus = (value: string, pattern: RegExp): 'valid' | 'invalid' | '' => {
    if (!value) return '';
    return pattern.test(value) ? 'valid' : 'invalid';
  };

  // Live validation messages
  const getNameValidationMessage = (value: string, fieldName: string): string => {
    if (!value) return `${fieldName} is required`;
    if (!/^[a-zA-Z\s]*$/.test(value)) return `${fieldName} must only contain letters and spaces`;
    return '';
  };

  const getNimValidationMessage = (value: string): string => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) return 'NIM must only contain numbers';
    if (value.length < 8) return 'NIM must be at least 8 characters';
    if (value.length > 20) return 'NIM must not exceed 20 characters';
    return '';
  };

  const getPhoneValidationMessage = (value: string): string => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) return 'Phone number must only contain numbers';
    if (value.length < 10) return 'Phone number must be at least 10 characters';
    if (value.length > 20) return 'Phone number must not exceed 20 characters';
    return '';
  };

  const resetForm = () => {
    if (user) {
      const [firstName = '', lastName = ''] = (user.fullName || '').split(' ');
      form.reset({
        firstName,
        lastName,
        email: user.email || '',
        nim: user.nim || '',
        phone: user.phone || '',
      });
    }
  };

  useEffect(() => {
    resetForm();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(values: SettingsFormValues) {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        nim: values.nim,
        phone: values.phone,
      });

      // Success notification
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated and your account is now marked as active.',
        variant: 'default',
      });
    } catch (error) {
      handleError(error, 'Failed to update profile. Please check your information and try again.');
    }
  }

  // Show loading state during initial auth check
  if (loading.initial) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Card className="bg-background">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid w-full md:block">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:w-2/3">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your first name"
                                className={cn(
                                  getFieldStatus(field.value, /^[a-zA-Z\s]*$/) === 'invalid' &&
                                    'border-red-500'
                                )}
                                {...field}
                              />
                            </FormControl>
                            {field.value && (
                              <FormMessage>
                                {getNameValidationMessage(field.value, 'First name')}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your last name"
                                className={cn(
                                  getFieldStatus(field.value || '', /^[a-zA-Z\s]*$/) ===
                                    'invalid' && 'border-red-500'
                                )}
                                {...field}
                              />
                            </FormControl>
                            {field.value && (
                              <FormMessage>
                                {getNameValidationMessage(field.value, 'Last name')}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            disabled={true}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your NIM"
                            className={cn(
                              getFieldStatus(field.value || '', /^\d+$/) === 'invalid' &&
                                'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <FormMessage>{getNimValidationMessage(field.value)}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+62"
                            className={cn(
                              getFieldStatus(field.value || '', /^\d+$/) === 'invalid' &&
                                'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <FormMessage>{getPhoneValidationMessage(field.value)}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={loading.overall || !form.formState.isValid}>
                      {loading.overall ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
}
