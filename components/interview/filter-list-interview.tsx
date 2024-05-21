'use client';

import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const FilterListInterview = ({ orgId }: { orgId: string }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex max-w-[200px]  items-center rounded-md border  bg-white p-2">
        <Input
          placeholder="search"
          className="h-auto border-none bg-transparent p-0 focus-visible:ring-0"
        />
        <Search className="size-3" />
      </div>
      <Link href={`/${orgId}/video/create`}>
        <Button>+ Create Template</Button>
      </Link>
    </div>
  );
};

export default FilterListInterview;
