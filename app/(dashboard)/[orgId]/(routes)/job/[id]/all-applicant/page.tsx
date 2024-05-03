import { NextPage } from 'next';
import type { ReactElement } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DetailJobTable } from '@/components/job/detail/table-detail-job';

const JobAllApplicantPage: NextPage = (): ReactElement => {
  return (
    <div>
      <div className="flex justify-center items-center text-xs gap-2 bg-rose-200 w-full py-3 rounded-md">
        <span>Dont forget to Analyze your CV for better results on candidates</span>
        <ShieldAlert />
      </div>

      <DetailJobTable />
    </div>
  )
};

export default JobAllApplicantPage;
