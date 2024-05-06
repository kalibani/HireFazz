'use server';

import CreateEndInterview from '@/components/interview/create-end-interview';
import CreateIntroInterview from '@/components/interview/create-intro-interview';
import CreateQuestionInterview from '@/components/interview/create-question-interview';
import SectionWrapLoad from '@/components/interview/section-wrapper';

const page = () => {
  return (
    <SectionWrapLoad isScroll>
      <CreateIntroInterview />
      <CreateQuestionInterview />
      <CreateEndInterview />
    </SectionWrapLoad>
  );
};

export default page;
