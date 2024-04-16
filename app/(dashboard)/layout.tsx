import React, { ReactNode } from 'react';
import {Navbar, SideBar} from '@/components/share';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-dvh overflow-y-hidden bg-[#F2F2F7]">
      <SideBar />
      <main className="w-full">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
