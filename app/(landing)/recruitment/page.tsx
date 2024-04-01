import {
  RecruitmentContent,
  RecruitmentHero,
  WrapperSection,
} from '@/components/landing-page';
import { Button } from '@/components/ui/button';
import React from 'react';

const recruitmentPage = () => {
  return (
    <WrapperSection className="px-4 pt-20 sm:px-12 xl:px-0">
      <RecruitmentHero />
      <RecruitmentContent />
      <div className="flex flex-col items-center justify-center gap-y-16 py-20 text-center">
        <h1 className="text-4xl font-bold lg:text-6xl">
          Ready to make your life more easy ?
        </h1>
        <p className="text-lg lg:text-2xl">
          Dont worry, it’s free as get started to say goodbye for repetitive
          task in recruitment.
        </p>
        <Button className=" font-normal">Take me There !</Button>
      </div>
    </WrapperSection>
  );
};

export default recruitmentPage;
