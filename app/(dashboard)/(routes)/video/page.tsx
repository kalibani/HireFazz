import InterviewList from '@/components/interview/interview-list';
import { SectionWrap } from '@/components/share';
import { getByIdJob, getJobList } from '@/lib/actions/job/getJob';

const Page = async () => {
  return (
    <SectionWrap>
      <InterviewList />
      {/* <HrVideo /> */}
      {/* <FormQuestion /> */}
    </SectionWrap>
  );
};

export default Page;
