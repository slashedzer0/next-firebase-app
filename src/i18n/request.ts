import { getRequestConfig } from 'next-intl/server';

export const getConfig = getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

// eslint-disable-next-line import/no-default-export
export default getConfig;
