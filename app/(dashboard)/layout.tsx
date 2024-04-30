import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Navbar, SideBar } from '@/components/share';
import { orgList } from '@/lib/actions/user/orgList';

const DashboardLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  const org = await orgList();
  console.log(org, '<<<<<');
  return (
    <div className="flex h-full min-h-screen overflow-y-auto bg-[#F2F2F7]">
      <SideBar />
      <main className="h-auto w-full">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
