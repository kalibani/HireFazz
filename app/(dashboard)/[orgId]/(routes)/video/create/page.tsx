import CreateEndInterview from '@/components/interview/create-end-interview';
import CreateIntroInterview from '@/components/interview/create-intro-interview';
import CreateQuestionInterview from '@/components/interview/create-question-interview';
import FormTemplate from '@/components/interview/form-template';
import SectionWrapLoad from '@/components/interview/section-wrapper';
import { type ParamsProps } from '@/types/types';

const page = ({ params }: ParamsProps) => {
  return (
    <SectionWrapLoad isScroll>
      <h3 className="text-2xl font-semibold">Create Automatic Interview</h3>
      <p className="text-sm font-normal text-slate-400">
        Create detail Interview with question here
      </p>
      <FormTemplate orgId={params.orgId} />
      {/* <CreateIntroInterview /> */}
      {/* <CreateQuestionInterview /> */}
      {/* <CreateEndInterview /> */}
    </SectionWrapLoad>
  );
};

export default page;
