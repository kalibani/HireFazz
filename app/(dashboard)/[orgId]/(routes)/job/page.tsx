import { BannerJob } from '@/components/job/bannerJob';
import { FilterJob } from '@/components/job/filterJob';
import { HeaderJob } from '@/components/job/headerJob';
import { TableJob } from '@/components/job/tableJob';
import { SectionWrap } from '@/components/share';
import { GetJobListData, getJobList } from '@/lib/actions/job/getJob';
import { ParamsProps } from '@/types/types';

const JobPage = async ({ params, searchParams }: ParamsProps) => {
  if (!params.orgId) return;
  const page = Number(searchParams.page || 1);
  const perPage = Number(searchParams.per_page || 10);
  const jobListData = (await getJobList(
    params.orgId,
    perPage,
    (page - 1) * perPage,
    searchParams,
  )) as GetJobListData;

  return (
    <SectionWrap isScroll>
      <BannerJob orgId={params.orgId} />
      <HeaderJob />
      <div className="h-fit rounded-md bg-white px-5 py-2.5">
        <FilterJob />
        <TableJob orgId={params.orgId} jobData={jobListData} />
      </div>
    </SectionWrap>
  );
};

export default JobPage;
