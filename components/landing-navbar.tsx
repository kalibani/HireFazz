'use client';

import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SelectLanguage from './select-languange';
import { useTranslations } from 'next-intl';

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const t = useTranslations('landing');

  const { isSignedIn } = useAuth();
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-12 w-16 mr-4">
          <Image fill alt="Logo" src="/BerryLabs.png" sizes="100%" />
        </div>
        <h1 className={cn('text-2xl font-bold text-white', font.className)}>
          BerryLabs
        </h1>
      </Link>
      <div className="flex items-center gap-x-2 ">
        <Link
          href={isSignedIn ? '/dashboard' : '/sign-up'}
          className="hidden md:block"
        >
          <Button variant="outline" className="rounded-full">
            {t('btn-start')}
          </Button>
        </Link>
        <SelectLanguage />
      </div>
    </nav>
  );
};
