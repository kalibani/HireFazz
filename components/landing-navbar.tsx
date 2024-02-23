'use client';

import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import useTranslation from 'next-translate/useTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SelectLanguage from './select-language';

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { t, lang } = useTranslation('landing');
  const { isSignedIn } = useAuth();
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link
        href={`/?lang=${lang}`}
        as={`/${lang}`}
        className="flex items-center"
      >
        <div className="relative h-12 w-16 mr-4">
          <Image fill alt="Logo" src="/BerryLabs.png" sizes="100%" />
        </div>
        <h1 className={cn('text-2xl font-bold text-white', font.className)}>
          BerryLabs
        </h1>
      </Link>
      <div className="flex items-center gap-x-2 w-fit">
        <Link
          href={
            isSignedIn ? `/dashboard?lang=${lang}` : `/sign-up?lang=${lang}`
          }
          as={isSignedIn ? `/${lang}/dashboard` : `/${lang}/sign-up`}
        >
          <Button variant="outline" className="rounded-full capitalize">
            {t`btn-start`}
          </Button>
        </Link>
        <SelectLanguage lang={lang} />
      </div>
    </nav>
  );
};
