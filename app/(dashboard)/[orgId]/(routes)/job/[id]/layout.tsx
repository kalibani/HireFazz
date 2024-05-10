import { HeaderDetailJob } from '@/components/job/detail/header-detail-job';
import { SidebarDetailJob } from '@/components/job/detail/sidebar-detail-job';
import { FC, PropsWithChildren } from 'react';
import { User, UserSearch, UserCheck, Users, UserX } from 'lucide-react';
import { GetJobDetailResponse, getByIdJob } from '@/lib/actions/job/getJob';
import { ParamsProps } from '@/types/types';
import { ANALYSYS_STATUS } from '@prisma/client';

const JobDetailTemplate: FC<ParamsProps & PropsWithChildren> = async ({ children, params, searchParams }) => {  
  const jobId = params.id || ''
  const jobDetail = await getByIdJob(jobId) as GetJobDetailResponse

  const jobData = jobDetail.data
  const cvAnalysis = jobData?.cvAnalysis || []
  const sidebarItems = [
    {
      text: 'All Applicant',
      link: '#',
      icon: <User className="size-5" />,
      notificationCount: cvAnalysis.length,
      isActive: true,
    },
    {
      text: 'Screened',
      link: '#',
      icon: <UserSearch className="size-5" />,
      notificationCount: cvAnalysis.filter((analysis) => analysis.status === ANALYSYS_STATUS.ON_ANALYSYS).length,
      isActive: false,
    },
    {
      text: 'Shortlisted',
      link: '#',
      icon: <UserCheck className="size-5" />,
      notificationCount: cvAnalysis.filter((analysis) => analysis.status === ANALYSYS_STATUS.SHORTLISTED).length,
      isActive: false,
    },
    {
      text: 'Interviewed',
      link: '#',
      icon: <Users className="size-5" />,
      notificationCount: cvAnalysis.filter((analysis) => analysis.status === ANALYSYS_STATUS.INTERVIEW).length,
      isActive: false,
    },
    {
      text: 'Rejected',
      link: '#',
      icon: <UserX className="size-5" />,
      notificationCount: cvAnalysis.filter((analysis) => analysis.status === ANALYSYS_STATUS.REJECTED).length,
      isActive: false,
    },
  ];

  if (!jobData) return null

  const salaryText = (() => {
    if (!jobData?.salaryRangeFrom || !jobData?.salaryRangeEnd) {
      return
    }

    return `${jobData?.salaryCurrency}${jobData?.salaryRangeFrom}-${jobData?.salaryRangeEnd}`
  })()
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
          {children}
        </div>
      </div>
    </section>
  );
};

export default JobDetailTemplate;
