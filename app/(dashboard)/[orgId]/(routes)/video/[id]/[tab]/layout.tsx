import { FC, PropsWithChildren } from 'react';
import { User, UserSearch, UserCheck, UserX } from 'lucide-react';
import { ParamsProps } from '@/types/types';
import { HeaderNavigation, SectionWrap } from '@/components/share';
import { SidebarDetailPage } from '@/components/share/sidebar-detail-page';
import getCountByStatus from '@/lib/actions/interview/getCountStatus';

const videoDetailTemplate: FC<ParamsProps & PropsWithChildren> = async ({
  children,
  params,
}) => {
  const interviewId = params.id || '';
  const orgId = params.orgId || '';
  const tab = params.tab || '';
  const candidates = await getCountByStatus(interviewId);
  const sidebarItems = [
    {
      text: 'Invited',
      link: `/${orgId}/video/${interviewId}/invited`,
      icon: <User className="size-5" />,
      notificationCount: candidates?.countByStatus.INVITED || 0,
      isActive: tab === 'invited',
    },
    {
      text: 'To Evaluate',
      link: `/${orgId}/video/${interviewId}/completed`,
      icon: <UserSearch className="size-5" />,
      notificationCount: candidates?.countByStatus.COMPLETED || 0,
      isActive: params.tab === 'completed',
    },
    {
      text: 'Shortlisted',
      link: `/${orgId}/video/${interviewId}/shortlisted`,
      icon: <UserCheck className="size-5" />,
      notificationCount: candidates?.countByStatus.SHORTLISTED || 0,
      isActive: params.tab === 'shortlisted',
    },
    {
      text: 'Rejected',
      link: `/${orgId}/video/${interviewId}/rejected`,
      icon: <UserX className="size-5" />,
      notificationCount: candidates?.countByStatus.REJECTED || 0,
      isActive: params.tab === 'rejected',
    },
  ];

  return (
    <>
      <HeaderNavigation
        urlPath={`/${orgId}/video`}
        isLabel
        tagLine="There is automatic has been created."
        title="Detail Interview"
      />
      <div className="flex h-full w-full gap-x-3">
        <SidebarDetailPage items={sidebarItems} title="Status" />
        <div className=" h-fit flex-1 rounded-lg bg-white p-3">{children}</div>
      </div>
    </>
  );
};

export default videoDetailTemplate;
