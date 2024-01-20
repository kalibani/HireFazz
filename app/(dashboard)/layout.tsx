import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getUser } from "@/lib/api-limit";

import { auth } from "@clerk/nextjs";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { userId } = auth();
  const { count, subscriptionType } = await getUser(userId!);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar apiLimitCount={count} subscriptionType={subscriptionType} />
      </div>
      <main className="md:pl-72 overflow-hidden">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
