import { ParamsProps } from '@/types/types';
import { GetJobDetailResponse, getByIdJob } from '@/lib/actions/job/getJob';
import { match } from 'ts-pattern';
import { notFound } from 'next/navigation';
import DetailJobScreened from '@/components/job/detail/screened';
import DetailJobAllApplicant from '@/components/job/detail/all-aplicant';
import DetailJobSendEmail from '@/components/job/detail/send-email';
import DetailJobShortlisted from '@/components/job/detail/short-listed';
import DetailJobRejected from '@/components/job/detail/rejected';
import { DetailJobInterviewed } from '@/components/job/detail/interviewed';

const JobDetailPage = async ({ params, searchParams }: ParamsProps) => {
  const jobId = params.id || '';
  const perPage = Number(searchParams.per_page || '10');
  const page = Number(searchParams.page || '1');
  const jobDetail = (await getByIdJob(
    jobId,
    perPage,
    (page - 1) * perPage,
  )) as GetJobDetailResponse;

  return match(params.tab as string)
    .with('all-applicant', () => (
      <DetailJobAllApplicant jobDetail={jobDetail} />
    ))
    .with('screened', () => <DetailJobScreened jobDetail={jobDetail} />)
    .with('shortlisted', () => <DetailJobShortlisted jobDetail={jobDetail} />)
    .with('interviewed', () => <DetailJobInterviewed />)
    .with('rejected', () => <DetailJobRejected jobDetail={jobDetail} />)
    .with('send-email', () => <DetailJobSendEmail jobDetail={jobDetail} />)
    .otherwise(() => notFound());
};

export default JobDetailPage;
