import { Input } from '@/components/ui/input';
import React from 'react';

const SearchFilter = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Invited</h2>
      <Input className="w-1/2" />
    </div>
  );
};

export default SearchFilter;
