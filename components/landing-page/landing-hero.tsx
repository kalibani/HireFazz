'use client';

import TypewriterComponent from 'typewriter-effect';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { WrapperSection } from '@/components/landing-page';
export const LandingHero = () => {
  const { isSignedIn } = useAuth();
  const linkRef = isSignedIn ? '/dashboard' : '/sign-up';
  return (
    <WrapperSection className="pb-14 pt-36 text-center font-bold  text-slate-950">
      <div className="px-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
        <h1 className="mx-auto">Say goodbye to repetitive tasks, hello to</h1>
        <div className="text-primary">a happier you</div>
      </div>
      <div className="mb-6 mt-9 flex justify-center">
        <Link href={linkRef} legacyBehavior passHref>
          <Button
            className="h-auto px-7 py-4  text-xl font-bold lg:text-2xl xl:px-9 xl:py-6 xl:text-3xl"
            variant="premium2"
          >
            Get Started for Free
          </Button>
        </Link>
        {/* <div className="p-4 text-lg font-normal text-foreground sm:p-0 sm:text-xl lg:text-2xl">
              {tagline}
            </div>
            <Link href={href} legacyBehavior passHref>
              <Button
                className="h-auto px-9 py-4 text-2xl font-medium"
                variant={variant}
              >
                {btnTitle}
              </Button>
            </Link> */}
      </div>
      <div className="p-4 text-lg font-normal text-foreground sm:p-0 sm:text-xl lg:text-2xl">
        Transform Your Repetitive Tasks into Effortless Actions!"
      </div>
    </WrapperSection>
  );
};
