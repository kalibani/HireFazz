
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { WrapperSection } from '@/components/landing-page';
export const LandingHero = () => {
  return (
    <WrapperSection className="mb-0 pb-14 pt-24 text-center font-bold text-slate-950 lg:mb-20 lg:pt-40">
      <div className="px-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
        <h1 className="mx-auto mb-6">
          Say goodbye to repetitive tasks, hello to
        </h1>
        <div className="text-primary">a happier you</div>
      </div>
      <div className="mb-6 mt-9 flex justify-center lg:mb-10 lg:mt-14">
        <Link href='/auth/login' legacyBehavior passHref>
          <Button
            className="h-auto rounded-lg px-7 py-4 text-xl font-bold lg:text-2xl xl:px-9 xl:py-4"
            variant="premium2"
          >
            Get Started for Free
          </Button>
        </Link>
      </div>
      <div className="p-4 text-lg font-normal text-foreground sm:p-0 sm:text-xl lg:my-6 lg:text-2xl">
        Transform Your Repetitive Tasks into Effortless Actions!
      </div>
    </WrapperSection>
  );
};
