'use client';

import TypewriterComponent from 'typewriter-effect';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <section className="text-slate-950 font-bold py-36 text-center ">
      <div className="text-4xl sm:text-5xl lg:text-6xl space-y-5 font-extrabold">
        <h1>Say goodbye to repetitive tasks, hello to</h1>
        <div className="text-primary">
          <TypewriterComponent
            options={{
              strings: ['a happier you'],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="flex justify-center mt-16 mb-4">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <div className="p-[2px] bg-gradient-to-r from-pink-500 to-primary  w-fit rounded-full">
            <Button
              variant="premium2"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              Start Generating For Free
            </Button>
          </div>
        </Link>
      </div>
      <div className="text-primary text-base md:text-base font-normal">
        Transform Your Repetitive Tasks into Effortless Actions!
      </div>
    </section>
  );
};
