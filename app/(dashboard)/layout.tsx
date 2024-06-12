import { FC, PropsWithChildren, ReactElement } from 'react';
import { Navbar, SideBar } from '@/components/share';
import { orgList } from '@/lib/actions/user/orgList';
import { TopupModal } from '@/components/topup-modal';

const DashboardLayout: FC<any> = async ({
  children,
  params,
}): Promise<ReactElement> => {
  console.log(params.orgId, ':::::::::::::::');
  return (
    <div className="flex h-full bg-[#F2F2F7]">
      <TopupModal />
      <SideBar />
      <Navbar />
      <main className="h-full w-full overflow-y-auto pl-[80px] pt-[60px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
