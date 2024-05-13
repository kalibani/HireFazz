import InterviewList from '@/components/interview/interview-list';
import { Banner, SectionWrap } from '@/components/share';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';
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
  console.log(interviews, '<<<<');
  return (
    <SectionWrap>
      <Banner
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
      />
      <div className="mb-8 flex flex-col  rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">List Automatic Interview</h3>
        <FilterListInterview orgId={params.orgId} />

        {interviews.map((interview) => (
          <InterviewList key={interview.id} title={interview.title} />
        ))}
      </div>
    </SectionWrap>
  );
};

export default Page;
