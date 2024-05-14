import { ParamsProps } from '@/types/types';
import { GetJobDetailResponse, getByIdJob } from '@/lib/actions/job/getJob';
import { match } from 'ts-pattern';
import { DetailJobScreened } from '@/components/job/detail/screened';
import { DetailJobAllApplicant } from '@/components/job/detail/all-aplicant';
import { DetailJobShortlisted } from '@/components/job/detail/short-listed';
import { DetailJobInterviewed } from '@/components/job/detail/interviewed';
import { DetailJobRejected } from '@/components/job/detail/rejected';
import { DetailJobSendEmail } from '@/components/job/detail/send-email';
import { notFound } from 'next/navigation';

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
    .with('screened', () => <DetailJobScreened />)
    .with('shortlisted', () => <DetailJobShortlisted />)
    .with('interviewed', () => <DetailJobInterviewed />)
    .with('rejected', () => <DetailJobRejected />)
    .with('send-email', () => <DetailJobSendEmail />)
    .otherwise(() => notFound());
};

export default JobDetailPage;
