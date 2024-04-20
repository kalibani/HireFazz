import { HeaderDetailJob } from '@/components/job/detail/header-detail-job';
import { SidebarDetailJob } from '@/components/job/detail/sidebar-detail-job';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { Camera } from 'lucide-react';

const JobDetailTemplate: FC<PropsWithChildren> = (props): ReactElement => {
  const sidebarItems = [
    {
      text: 'Job Descriptions',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
    },
    {
      text: 'All Applicant',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
      notificationCount: 2,
    },
    {
      text: 'Screened',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
      notificationCount: 24,
    },
    {
      text: 'Shortlisted',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
      notificationCount: 24,
    },
    {
      text: 'Rejected',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
      notificationCount: 24,
    },
    {
      text: 'Contacted',
      link: '#',
      icon: <Camera className="h-5 w-5" />,
      notificationCount: 24,
    },
  ];
  return (
    <main className="w-full px-3">
      <HeaderDetailJob title="Senior Software Engineer" />
      <SidebarDetailJob items={sidebarItems} />
      {props.children}
    </main>
  );
};

export default JobDetailTemplate;
