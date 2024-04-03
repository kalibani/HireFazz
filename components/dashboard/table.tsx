'use client';

import React from 'react';
import { DataTable } from '../table/data-table';

const DashboardTable = () => {
  return (
    <DataTable
      tableClassName="rounded-md border-r-gray-200/70 border-l-gray-200/70 border relative"
      tableHeaderClassName="bg-gray-300/30"
      tableHeadClassName="text-black font-bold"
      columns={[]}
      data={[] || []}
      pageIndex={1}
      pageSize={10}
      onNextPage={() => {}}
      onPreviousPage={() => {}}
      disableNextPage={false}
      disablePreviousPage={true}
      isLoading={false}
    />
  );
};

export default DashboardTable;
