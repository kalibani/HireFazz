import { HeaderDetailJob } from '@/components/job/detail/header-detail-job';
import { SidebarDetailJob } from '@/components/job/detail/sidebar-detail-job';
import { FC, PropsWithChildren } from 'react';
import {
  User,
  UserSearch,
  UserCheck,
  Users,
  UserX,
  ShieldAlert,
} from 'lucide-react';
import { GetJobDetailResponse, getByIdJob } from '@/lib/actions/job/getJob';
import { ParamsProps } from '@/types/types';
import { ANALYSYS_STATUS } from '@prisma/client';

const JobDetailTemplate: FC<ParamsProps & PropsWithChildren> = async ({
  children,
  params,
}) => {
  const jobId = params.id || '';
  const orgId = params.orgId || '';
  const jobDetail = (await getByIdJob(jobId)) as GetJobDetailResponse;
  const jobData = jobDetail.data;
  const cvAnalysis = jobData?.cvAnalysis || [];
  const sidebarItems = [
    {
      text: 'All Applicant',
      link: `/${orgId}/job/${jobId}/all-applicant`,
      icon: <User className="size-5" />,
      notificationCount: cvAnalysis.length,
      isActive: params.tab === 'all-applicant',
    },
    {
      text: 'Screened',
      link: `/${orgId}/job/${jobId}/screened`,
      icon: <UserSearch className="size-5" />,
      notificationCount: cvAnalysis.filter(
        (analysis) => analysis.status === ANALYSYS_STATUS.ON_ANALYSYS,
      ).length,
      isActive: params.tab === 'screened',
    },
    {
      text: 'Shortlisted',
      link: `/${orgId}/job/${jobId}/shortlisted`,
      icon: <UserCheck className="size-5" />,
      notificationCount: cvAnalysis.filter(
        (analysis) => analysis.status === ANALYSYS_STATUS.SHORTLISTED,
      ).length,
      isActive: params.tab === 'shortlisted',
    },
    {
      text: 'Interviewed',
      link: `/${orgId}/job/${jobId}/interviewed`,
      icon: <Users className="size-5" />,
      notificationCount: cvAnalysis.filter(
        (analysis) => analysis.status === ANALYSYS_STATUS.INTERVIEW,
      ).length,
      isActive: params.tab === 'interviewed',
    },
    {
      text: 'Rejected',
      link: `/${orgId}/job/${jobId}/rejected`,
      icon: <UserX className="size-5" />,
      notificationCount: cvAnalysis.filter(
        (analysis) => analysis.status === ANALYSYS_STATUS.REJECTED,
      ).length,
      isActive: params.tab === 'rejected',
    },
  ];

  if (!jobData) return null;

  const salaryText = (() => {
    if (!jobData?.salaryRangeFrom || !jobData?.salaryRangeEnd) {
      return;
    }

    return `${jobData?.salaryCurrency}${jobData?.salaryRangeFrom}-${jobData?.salaryRangeEnd}`;
  })();
  return (
    <section className="w-full px-3">
      <HeaderDetailJob
        title={jobData?.jobName}
        description={jobData?.jobDescription}
        experience={jobData?.experience}
        location={jobData?.location}
        salaryText={salaryText}
        workModel={jobData?.workModel}
      />
      <div className="flex w-full gap-x-3">
        <SidebarDetailJob items={sidebarItems} />
        <div className="mt-3 h-full min-h-screen flex-1 rounded-lg bg-white p-3">
          <div className="flex w-full items-center justify-center gap-2 rounded-md bg-rose-200 py-3 text-xs">
            <span>
              Dont forget to Analyze your CV for better results on candidates
            </span>
            <ShieldAlert />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default JobDetailTemplate;
