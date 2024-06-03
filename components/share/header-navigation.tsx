'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { Undo2 } from 'lucide-react';

const HeaderNavigation = () => {
  const { back } = useRouter();
  return (
    <div className="rounded-md bg-white p-3 text-black">
      <Button
        variant="ghost"
        className="flex items-center gap-x-2"
        onClick={() => back()}
      >
        <Undo2 className="text-primary" />
        Back
      </Button>
    </div>
  );
};

export default HeaderNavigation;
