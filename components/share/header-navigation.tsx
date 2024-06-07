'use client';

import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { Button } from '../ui/button';
import { Undo2 } from 'lucide-react';

interface Props {
  isLabel?: boolean;
  tagLine?: string;
  title?: string;
}

const HeaderNavigation: FC<Props> = ({ title, isLabel = false, tagLine }) => {
  const { back } = useRouter();
  return (
    <div className="flex w-full items-center justify-between rounded-md bg-primary bg-white px-4 py-3 text-black">
      <Button
        variant="ghost"
        className="flex items-center gap-x-2"
        onClick={() => back()}
      >
        <Undo2 className="text-primary" />
        Back
      </Button>
      {isLabel && (
        <div className="flex w-fit flex-col rounded-md bg-white text-right">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-sm text-slate-400">{tagLine}</p>
        </div>
      )}
    </div>
  );
};

export default HeaderNavigation;
