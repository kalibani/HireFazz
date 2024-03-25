import React from 'react';
import { Button } from '../ui/button';
import enhance from '@/public/image/enhance.png';
import Image from 'next/image';
import Link from 'next/link';
function RecruitmentHero() {
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-x-6 lg:flex-row">
      <div className="flex w-full flex-col gap-y-6 lg:w-[65%]">
        <h2 className="text-2xl font-bold md:text-4xl">
          Enhance Recruitment Efficiency Using AI Matching Score
        </h2>
        <p className="text-sm text-second-text md:text-base">
          Drowning in resumes? AI Matching Scores use smarts, not hunches, to
          identify top talent. Save time, reduce bias, and find the perfect fit
          faster - all with the power of AI.
        </p>
        <div className="flex gap-x-5">
          <Link href="/sign-up">
            <Button className="h-auto  text-base font-normal">
              Get Started for Free
            </Button>
          </Link>
          <Button variant="ghost" className="text-sm font-bold md:text-base">
            Or book demo.
          </Button>
        </div>
      </div>
      <Image src={enhance} alt="picture" sizes="100%" quality={80} />
    </div>
  );
}

export default RecruitmentHero;
