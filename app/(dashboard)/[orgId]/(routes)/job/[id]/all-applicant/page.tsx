import { NextPage } from 'next';
import type { ReactElement } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DetailJobTable } from '@/components/job/detail/table-detail-job';
import { ParamsProps } from '@/types/types';
import { GetJobDetailResponse, Job, getByIdJob } from '@/lib/actions/job/getJob';

const JobAllApplicantPage = async ({ params, searchParams }: ParamsProps) => {
  const jobId = params.id || ''
  const perPage = Number(searchParams.per_page || '10')
  const page = Number(searchParams.page || '1')
  const jobDetail = await getByIdJob(jobId, perPage, (page - 1) * perPage) as GetJobDetailResponse

  return (
    <div>
      <div className="flex justify-center items-center text-xs gap-2 bg-rose-200 w-full py-3 rounded-md">
        <span>Dont forget to Analyze your CV for better results on candidates</span>
        <ShieldAlert />
      </div>

      <DetailJobTable jobDetail={jobDetail} />
    </div>
  )
};

export default JobAllApplicantPage;
