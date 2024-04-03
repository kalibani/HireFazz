import { BannerJob } from '@/components/job/bannerJob';
import { FilterJob } from '@/components/job/filterJob';
import { HeaderJob } from '@/components/job/headerJob';
import { TableJob } from '@/components/job/tableJob';
import { Button } from '@/components/ui/button';

const JobPage = () => {
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 p-3.5">
      <BannerJob />
      <HeaderJob />
      <div className="mt-4 min-h-[-webkit-fill-available] rounded-md bg-white px-5 py-2.5">
        <FilterJob />
        <TableJob />
        <Button className="mt-5">+ Create New Job</Button>
      </div>
    </div>
  );
};

export default JobPage;
