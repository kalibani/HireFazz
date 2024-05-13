'use client';

import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const FilterListInterview = ({ orgId }: { orgId: string }) => {
  return (
    <div className="mt-10 flex items-center justify-between">
      <Link href={`/${orgId}/video/create`}>
        <Button variant="secondary">+ Add Automatic Interview</Button>
      </Link>
      <div className="flex max-w-[200px] items-center rounded-md border p-2">
        <Input
          placeholder="search"
          className="h-auto border-none p-0 focus-visible:ring-0"
        />
        <Search className="size-3" />
      </div>
    </div>
  );
};

export default FilterListInterview;
