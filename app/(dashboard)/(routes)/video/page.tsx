import FormQuestion from '@/components/interview/form-question';
import HrVideo from '@/components/interview/hr-video';
import { SectionWrap } from '@/components/share';

const Page = () => {
  return (
    <SectionWrap>
      <HrVideo />
      <FormQuestion />
    </SectionWrap>
  );
};

export default Page;
