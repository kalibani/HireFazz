import CreateEndInterview from '@/components/interview/create-end-interview';
import CreateIntroInterview from '@/components/interview/create-intro-interview';
import CreateQuestionInterview from '@/components/interview/create-question-interview';
import { SectionWrap } from '@/components/share';

const page = () => {
  return (
    <SectionWrap isScroll>
      <CreateIntroInterview />
      <CreateQuestionInterview />
      <CreateEndInterview />
    </SectionWrap>
  );
};

export default page;
