import InterviewList from '@/components/interview/interview-list';
import { SectionWrap } from '@/components/share';
import { Button } from '@/components/ui/button';
import { getTemplateInterview } from '@/lib/actions/interview/getTemplatesInterview';
import { ParamsProps } from '@/types/types';
import Link from 'next/link';

type Interview = {
  id: string;
  title: string;
};

const Page = async ({ params }: ParamsProps) => {
  const interviews = (await getTemplateInterview({
    organizationId: params.orgId,
  })) as Interview[];
  console.log(interviews, '<<<<<');
  return (
    <SectionWrap>
      <div className="mb-8 flex flex-col items-center justify-center rounded-md bg-white p-4">
        <Link href={`/${params.orgId}/video/create`}>
          <Button>Create Interview</Button>
        </Link>
        {interviews.map((interview) => (
          <InterviewList key={interview.id} title={interview.title} />
        ))}
      </div>
      {/* <HrVideo /> */}
      {/* <FormQuestion /> */}
    </SectionWrap>
  );
};

export default Page;
