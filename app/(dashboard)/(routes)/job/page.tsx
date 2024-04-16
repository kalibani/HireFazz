import { BannerJob } from '@/components/job/bannerJob';
import { FilterJob } from '@/components/job/filterJob';
import { HeaderJob } from '@/components/job/headerJob';
import { TableJob } from '@/components/job/tableJob';
import { SectionWrap } from '@/components/share';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const JobPage = () => {
  return (
    <SectionWrap>
      <BannerJob />
      <HeaderJob />
      <div className="rounded-md bg-white px-5 py-2.5 min-h-svh">
        <FilterJob />
        <TableJob />
        <Link href="/job/create">
          <Button className="mt-5">+ Create New Job</Button>
        </Link>
      </div>
    </SectionWrap>
  );
};

export default JobPage;
