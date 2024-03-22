import {
  RecruitmentContent,
  RecruitmentHero,
  WrapperSection,
} from '@/components/landing-page';
import React from 'react';

const recruitmentPage = () => {
  return (
    <WrapperSection className="px-4 pt-20 sm:px-12 xl:px-16">
      <RecruitmentHero />
      <RecruitmentContent />
    </WrapperSection>
  );
};

export default recruitmentPage;
