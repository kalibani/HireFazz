import { FC, PropsWithChildren, ReactElement } from 'react';
import { Navbar, SideBar } from '@/components/share';
import { orgList } from '@/lib/actions/user/orgList';
import { TopupModal } from '@/components/topup-modal';

const DashboardLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  return (
    <main className="flex h-full bg-[#F2F2F7]">
      <TopupModal />
      <SideBar />
      <Navbar />
      <section className="h-full w-full overflow-y-auto pl-[80px] pt-[60px]">
        {children}
      </section>
    </main>
  );
};

export default DashboardLayout;
