import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Navbar, SideBar } from '@/components/share';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
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
