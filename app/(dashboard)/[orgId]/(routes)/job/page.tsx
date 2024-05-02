import { BannerJob } from '@/components/job/bannerJob';
import { FilterJob } from '@/components/job/filterJob';
import { HeaderJob } from '@/components/job/headerJob';
import { TableJob } from '@/components/job/tableJob';
import { SectionWrap } from '@/components/share';
import { ParamsProps } from '@/types/types';

const JobPage = ({ params }: ParamsProps) => {
  return (
    <SectionWrap>
      <BannerJob orgId={params?.orgId} />
      <HeaderJob />
      <div className="min-h-svh rounded-md bg-white px-5 py-2.5">
        <FilterJob />
        <TableJob />
      </div>
    </SectionWrap>
  );
};

export default JobPage;
