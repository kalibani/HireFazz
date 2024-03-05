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
      <div className=" border rounded-md mt-4 px-4 py-2 divide-y sticky top-1 bg-white/80 backdrop-blur-md">
        <div className="flex items-center">
          <Input
            name="search"
            className="w-full border-0 ring-0 outline-none focus-visible:ring-0 text-lg p-0 h-fit bg-transparent"
            value={searchValue}
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {!!searchValue ? (
            <Button
              type="submit"
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => onSubmit('delete')}
            >
              <XCircle />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => onSubmit('enter')}
            >
              <Search />
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
