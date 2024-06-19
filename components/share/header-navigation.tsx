import React, { FC } from 'react';
import { Button } from '../ui/button';
import { Undo2 } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface Props {
  isLabel?: boolean;
  tagLine?: string;
  title?: string;
  urlPath: string;
}

const HeaderNavigation: FC<Props> = async ({
  title,
  isLabel = false,
  tagLine,
  urlPath,
}) => {
  const t = await getTranslations('Interview')
  return (
    <div className="flex min-h-14 w-full items-center justify-between rounded-md bg-primary bg-white px-4 py-2 text-black">
      <Link href={urlPath}>
        <Button
          variant="ghost"
          className="w-tit flex h-auto items-center gap-x-2 p-0 hover:bg-transparent"
        >
          <Undo2 className="text-primary" />
          {t('back')}
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
