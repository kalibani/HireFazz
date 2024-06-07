'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const query = searchParams.get('q');

  // need improvement bounce
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Invited</h2>
      <div className="flex items-center rounded-md border px-3">
        <Search className="size-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={query || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="paragraph-regular  no-focus placeholder border-none bg-transparent text-slate-400 shadow-none outline-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
};

export default SearchFilter;
