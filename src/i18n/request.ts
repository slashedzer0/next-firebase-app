import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/i18n/locale';

export const getConfig = getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

// eslint-disable-next-line import/no-default-export
export default getConfig;
