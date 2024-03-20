'use client';

import TypewriterComponent from 'typewriter-effect';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { WrapperSection } from '@/components/landing-page';
import { cn } from '@/lib/utils';

interface LandingHeroProps {
  title: string;
  isPoint?: boolean;
  btnTitle: string;
  variant:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'premium'
    | 'premium2'
    | null
    | undefined;
  tagline: string;
  href: string;
  classNameH1?: string;
}

export const LandingHero = ({
  title,
  btnTitle,
  isPoint = false,
  tagline,
  variant,
  href,
  classNameH1,
}: LandingHeroProps) => {
  const { isSignedIn } = useAuth();
  const linkRef = isSignedIn ? '/dashboard' : '/sign-up';
  return (
    <WrapperSection className="pb-14 pt-36 text-center font-bold  text-slate-950">
      <div className="text-4xl font-bold sm:space-y-5 sm:text-6xl lg:text-6xl">
        <h1 className={cn('mx-auto sm:p-10', classNameH1)}>{title}</h1>
        {isPoint && <div className="text-primary">a happier you</div>}
      </div>
      <div className="mb-6 mt-16 flex justify-center">
        {isPoint ? (
          <Link href={linkRef} legacyBehavior passHref>
            <Button
              className="p-4 py-8 text-xl font-bold sm:px-36 sm:py-24 sm:text-4xl md:p-6"
              variant={variant}
            >
              {btnTitle}
            </Button>
          </Link>
        ) : (
          <Link href={href} legacyBehavior passHref>
            <Button
              className="p-4 py-8 text-xl font-bold sm:px-36 sm:py-24 sm:text-4xl md:p-6 md:text-lg"
              variant={variant}
            >
              {btnTitle}
            </Button>
          </Link>
        )}
      </div>
      <div className="p-4 text-base font-normal text-foreground md:text-base">
        {tagline}
      </div>
    </WrapperSection>
  );
};
