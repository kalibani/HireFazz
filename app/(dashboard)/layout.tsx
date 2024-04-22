import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { getUser } from '@/lib/api-limit';

import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { count, subscriptionType, maxFreeCount, isUserAgreedTermsOfService } =
    await getUser();
  return (
    <div className=" flex h-full bg-[#F2F2F7]">
      {/* <div className="hidden h-full bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <Sidebar
          apiLimitCount={count}
          subscriptionType={subscriptionType}
          maxFreeCount={maxFreeCount!}
          isUserAgreedTermsOfService={isUserAgreedTermsOfService}
        />

      </div> */}
      <Sidebar />
      <div className="flex h-full w-full flex-col gap-y-3 overflow-clip">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
