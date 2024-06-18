import React, { FC } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface CardTotalProp {
  title: string;
  total: number;
  link: string;
  linkTitle: string;
  icon: JSX.Element;
}

const CardTotal: FC<CardTotalProp> = ({
  title,
  link,
  linkTitle,
  total,
  icon,
}) => {
  return (
    <div className="flex items-center gap-x-3 py-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-rose-600">
        {icon}
      </div>
      <div className="flex flex-col capitalize">
        <p className="text-xs font-normal">{title}</p>
        <p className="text-5xl font-extrabold text-rose-600">{total}</p>
        {/* <Link href={link} className='flex gap-x-1 items-center text-slate-400 text-[8px] font-normal cursor-pointer'>
          <p className='underline'>{linkTitle}</p>
          <ArrowUpRight className='w-3'/>
        </Link> */}
      </div>
    </div>
  );
};

export default CardTotal;
