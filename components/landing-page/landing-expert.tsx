import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { WrapperSection } from '@/components/landing-page';
const LandingExpert = () => {
  return (
    <WrapperSection className="pb-14 pt-36 text-center font-bold  text-slate-950">
      <div className="mx-auto flex max-w-5xl  flex-col text-2xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
        <p className="mx-auto">Haven't found which package is</p>
        <p className="mx-auto">right for you?</p>
      </div>
      <p className="mt-4 px-4 text-base font-normal text-foreground text-second-text sm:mt-8 sm:px-14 sm:text-lg lg:text-2xl">
        We've got you covered! Tal to our experts to find the best solution for
        you, anytime for free!
      </p>
      <div className="mb-6 mt-9 flex justify-center">
        <Link href="/comming" legacyBehavior passHref>
          <Button className="h-auto px-7 py-2 text-lg font-medium sm:text-xl lg:px-9 lg:py-4 lg:text-2xl">
            Talk to Expert
          </Button>
        </Link>
      </div>
    </WrapperSection>
  );
};

export default LandingExpert;
