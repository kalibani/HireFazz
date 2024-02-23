'use client';

import TypewriterComponent from 'typewriter-effect';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import useTranslation from 'next-translate/useTranslation';

export const LandingHero = () => {
  const { t } = useTranslation('landing');
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>{t('hero-title')}</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-600 py-2">
          <TypewriterComponent
            options={{
              strings: [
                t('running-text.1'),
                t('running-text.2'),
                t('running-text.3'),
                t('running-text.4'),
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-white">
        {t('tag-line.1')}
      </div>
      <div>
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button
            variant="premium2"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            {t('cta')}
          </Button>
        </Link>
      </div>
      <div className="text-white text-base md:text-base font-normal">
        {t('tag-line.2')}
      </div>
    </div>
  );
};
