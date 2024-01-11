"use client"

import React from "react";
import { SquareStack } from "lucide-react";

import Heading from "@/components/headings";
import HistoryTable from "@/components/history-table";

const HistoryPage = () => {
  return (
    <>
      <Heading
        title="History"
        description="Full list of all your generated samples, ready for download."
        icon={SquareStack}
        iconColor="text-orange-700"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8 mt-10">
        <HistoryTable />
      </div>
    </>
  );
};

export default HistoryPage;
