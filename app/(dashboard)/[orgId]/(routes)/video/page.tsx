import InterviewList from '@/components/interview/interview-list';
import { getTemplateInterview } from '@/lib/actions/interview/getTemplatesInterview';
import { ParamsProps } from '@/types/types';
import FilterListInterview from '@/components/interview/filter-list-interview';

type Interview = {
  id: string;
  title: string;
};

const Page = async ({ params }: ParamsProps) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as Interview[];
  return (
    <>
      <div className="mb-8 flex flex-col  rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">List Automatic Interview</h3>
        <p className="text-sm font-normal text-slate-400">
          There is automatic has been created.
        </p>
      </div>
      <FilterListInterview orgId={params.orgId} />
      {interviews.map((interview) => (
        <InterviewList
          key={interview.id}
          title={interview.title}
          id={interview.id}
        />
      ))}
    </>
  );
};

export default Page;
