'use client';
import React, { useEffect, useState } from 'react';

import { Search, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { SearchParamsProps } from '@/types/types';
import { queryString, removeProperty } from '@/lib/utils';

const SearchInput = ({ searchParams }: SearchParamsProps) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const queryParams = searchParams;

  // const query = searchParams.get('q');
  const [searchValue, setSearchValue] = useState(queryParams.q || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        const newParams = queryString({ ...queryParams, q: searchValue });
        push(`${pathname}?${newParams}`, { scroll: false });
      } else {
        const updateParams = queryString(removeProperty(queryParams, 'q'));
        push(`${pathname}?${updateParams}`, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, pathname, queryParams, push]);

  const onSubmit = (type: 'delete' | 'enter') => {
    if (type === 'delete') {
      setSearchValue('');
    }
  };
  return (
    <>
      <div className="border rounded-md px-4 py-1 divide-y bg-white/80 backdrop-blur-md w-full lg:w-1/2  xl:w-1/3">
        <div className="flex items-center w-full">
          <Input
            name="search"
            className="w-full border-0 ring-0 outline-none focus-visible:ring-0 text-lg p-0 h-fit bg-transparent"
            value={searchValue}
            placeholder="Search by name"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {!!searchValue ? (
            <Button
              type="submit"
              variant="ghost"
              className="hover:bg-transparent p-0"
              onClick={() => onSubmit('delete')}
            >
              <XCircle className="w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className="hover:bg-transparent p-0"
              onClick={() => onSubmit('enter')}
            >
              <Search className="w-5" />
            </Button>
          )}
        </div>

        {/* {!!searchValue &&
          autoSugession.length !== 0 &&
          autoSugession.map((file: any) => (
            <div
              className="p-2 hover:bg-primary-foreground rounded-md cursor-pointer"
              key={file.id}
            >
              {file.name}
            </div>
          ))} */}
      </div>
    </>
  );
};

export default SearchInput;
