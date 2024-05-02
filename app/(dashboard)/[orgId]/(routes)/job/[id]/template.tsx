import { HeaderDetailJob } from '@/components/job/detail/header-detail-job';
import { SidebarDetailJob } from '@/components/job/detail/sidebar-detail-job';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { User, UserSearch, UserCheck, Users, UserX } from 'lucide-react';

const JobDetailTemplate: FC<PropsWithChildren> = (props): ReactElement => {
  const sidebarItems = [
    {
      text: 'All Applicant',
      link: '#',
      icon: <User className="size-5" />,
      notificationCount: 38,
      isActive: true,
    },
    {
      text: 'Screened',
      link: '#',
      icon: <UserSearch className="size-5" />,
      notificationCount: 20,
      isActive: false,
    },
    {
      text: 'Shortlisted',
      link: '#',
      icon: <UserCheck className="size-5" />,
      notificationCount: 15,
      isActive: false,
    },
    {
      text: 'Interviewed',
      link: '#',
      icon: <Users className="size-5" />,
      notificationCount: 12,
      isActive: false,
    },
    {
      text: 'Rejected',
      link: '#',
      icon: <UserX className="size-5" />,
      notificationCount: 8,
      isActive: false,
    },
  ];
  return (
    <section className="w-full px-3">
      <HeaderDetailJob title="Senior Software Engineer" />
      <div className="flex w-full gap-x-3">
        <SidebarDetailJob items={sidebarItems} />
        <div className="mt-3 h-full min-h-screen flex-1 rounded-lg bg-white p-3">
          {props.children}
        </div>
      </div>
    </section>
  );
};

export default JobDetailTemplate;
