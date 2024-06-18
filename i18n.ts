import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';

export type Locale = 'en' | 'id'
const locales: Locale[] = ['en', 'id'];
export type TFunction = (key: string, variable?: Record<string, string>) => string
 
export default getRequestConfig(async () => {
  // Validate that the incoming `locale` parameter is valid
  const headerCookies = cookies()
  let locale = headerCookies.get('lang')?.value || ''
 
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'id'
  }
 
  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default
  };
});