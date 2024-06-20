import React, { FC } from 'react';
import { Button } from '../ui/button';
import { Undo2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  isLabel?: boolean;
  tagLine?: string;
  title?: string;
  urlPath: string;
}

const HeaderNavigation: FC<Props> = ({
  title,
  isLabel = false,
  tagLine,
  urlPath,
}) => {
  return (
    <div className="flex min-h-14 w-full items-center justify-between rounded-md bg-primary bg-white px-4 py-3 text-black">
      <Link href={urlPath}>
        <Button
          variant="ghost"
          className="w-tit flex h-auto items-center gap-x-2 p-0 hover:bg-transparent"
        >
          <Undo2 className="text-primary" />
          Back
        </Button>
      </Link>
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
