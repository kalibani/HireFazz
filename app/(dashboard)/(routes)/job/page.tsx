import { BannerJob } from '@/components/job/bannerJob';
import { FilterJob } from '@/components/job/filterJob';
import { HeaderJob } from '@/components/job/headerJob';
import { TableJob } from '@/components/job/tableJob';
import { SectionWrap } from '@/components/share';

const JobPage = () => {
  return (
    <SectionWrap>
      <BannerJob />
      <HeaderJob />
      <div className="rounded-md bg-white px-5 py-2.5 min-h-svh">
        <FilterJob />
        <TableJob />
      </div>
    </SectionWrap>
  );
};

export default JobPage;
