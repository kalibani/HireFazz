import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { WrapperSection } from '@/components/landing-page';
const LandingExpert = () => {
  return (
    <WrapperSection className="pb-14  text-center font-bold  text-slate-950">
      <div className="mx-auto flex max-w-5xl  flex-col text-2xl sm:text-2xl lg:text-5xl xl:text-6xl">
        <p className="mx-auto">Haven't found which package is</p>
        <p className="mx-auto">right for you?</p>
      </div>
      <p className="mt-4 px-4 font-normal text-foreground text-second-text sm:mt-8 sm:px-14 lg:text-xl xl:text-2xl">
        We've got you covered! Tal to our experts to find the best solution for
        you, anytime for free!
      </p>
      <div className="mb-6 mt-9 flex justify-center">
        <Link href="/comming" legacyBehavior passHref>
          <Button className="text-lg font-medium hover:bg-primary">
            Talk to Expert
          </Button>
        </Link>
      </div>
    </WrapperSection>
  );
};

export default LandingExpert;
