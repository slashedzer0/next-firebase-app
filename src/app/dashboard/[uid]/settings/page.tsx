'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsFormSchema, type SettingsFormValues } from '@/schemas/settings';
import { Spinner } from '@/components/spinner';
import { useAuth } from '@/stores/use-auth-store';
import { cn, handleError, toast } from '@/utils';

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

import { useTranslations } from 'next-intl';

export default function UserDashboardSettingsPage() {
  const t = useTranslations('DashboardPage');
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
    if (!value) return t('required', { field: t(fieldName) });
    if (!/^[a-zA-Z\s]*$/.test(value)) return t('onlyLetters', { field: t(fieldName) });
    return '';
  };

  const getNimValidationMessage = (value: string): string => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) return t('nimNumbers');
    if (value.length < 8) return t('nimMin');
    if (value.length > 20) return t('nimMax');
    return '';
  };

  const getPhoneValidationMessage = (value: string): string => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) return t('phoneNumbers');
    if (value.length < 10) return t('phoneMin');
    if (value.length > 20) return t('phoneMax');
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
      toast.success(t('profileUpdated'));
    } catch (error) {
      handleError(error, t('failedUpdate'));
    }
  }

  // Show loading state during initial auth check
  if (loading.initial) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{t('loading')}</p>
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{t('pleaseSignIn')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('settingsTitle')}</h1>
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
                            <FormLabel>{t('firstName')}</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className={cn(
                                  getFieldStatus(field.value, /^[a-zA-Z\s]*$/) === 'invalid' &&
                                    'border-red-500'
                                )}
                                {...field}
                              />
                            </FormControl>
                            {field.value && (
                              <FormMessage className="text-xs">
                                {getNameValidationMessage(field.value, 'firstName')}
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
                            <FormLabel>{t('lastName')}</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className={cn(
                                  getFieldStatus(field.value || '', /^[a-zA-Z\s]*$/) ===
                                    'invalid' && 'border-red-500'
                                )}
                                {...field}
                              />
                            </FormControl>
                            {field.value && (
                              <FormMessage className="text-xs">
                                {getNameValidationMessage(field.value, 'lastName')}
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
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input type="email" disabled={true} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nim')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className={cn(
                              getFieldStatus(field.value || '', /^\d+$/) === 'invalid' &&
                                'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <FormMessage className="text-xs">
                            {getNimValidationMessage(field.value)}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone')}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            className={cn(
                              getFieldStatus(field.value || '', /^\d+$/) === 'invalid' &&
                                'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        {field.value && (
                          <FormMessage className="text-xs">
                            {getPhoneValidationMessage(field.value)}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 md:flex gap-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      {t('reset')}
                    </Button>
                    <Button type="submit" disabled={loading.overall || !form.formState.isValid}>
                      {loading.overall ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          {t('saving')}
                        </>
                      ) : (
                        t('saveChanges')
                      )}
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
