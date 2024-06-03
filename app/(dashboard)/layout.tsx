import { FC, PropsWithChildren, ReactElement } from 'react';
import { Navbar, SideBar } from '@/components/share';
import { orgList } from '@/lib/actions/user/orgList';
import { TopupModal } from '@/components/topup-modal';

const DashboardLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  const org = await orgList();
  return (
    <div className="flex h-full bg-[#F2F2F7]">
      <TopupModal />
      <SideBar />
      <Navbar orgs={org} />
      <main className="h-full w-full overflow-y-auto py-[60px] pl-[80px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
