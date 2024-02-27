import React, { ReactNode, Suspense } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { getUser } from '@/lib/api-limit';

import { auth } from '@clerk/nextjs';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { userId } = auth();
  const { count, subscriptionType, maxFreeCount, isUserAgreedTermsOfService } =
    await getUser(userId!);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar
          apiLimitCount={count}
          subscriptionType={subscriptionType}
          maxFreeCount={maxFreeCount!}
          isUserAgreedTermsOfService={isUserAgreedTermsOfService}
        />
      </div>
      <main className="md:pl-72 overflow-clip">
        <Navbar />

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
