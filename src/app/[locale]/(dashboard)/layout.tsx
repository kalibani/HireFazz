import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';
import WrapperTranslate from '@/components/wrapper-translate/wrapper-translate';
import { getUser } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs';
import Sidebar from '@/components/sidebar';

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
        <WrapperTranslate section="dashboard">
          <Sidebar
            apiLimitCount={count}
            subscriptionType={subscriptionType}
            maxFreeCount={maxFreeCount!}
            isUserAgreedTermsOfService={isUserAgreedTermsOfService}
          />
        </WrapperTranslate>
      </div>
      <main className="md:pl-72 overflow-clip">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
