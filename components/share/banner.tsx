import React, { FC } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

interface BannerProps {
  src: string;
  title: string;
  desc: string;
  btnTitle: string;
}

const Banner: FC<BannerProps> = ({ src, title, desc, btnTitle }) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-600 via-[#A24688] to-[#4E3ABA] px-11 py-4">
      <div className="flex-1 text-white">
        <h1 className="text-3xl mb-5">{title}</h1>
        <p className="max-w-[883px] text-sm">{desc}</p>
        <Button className="w-fit text-sm font-medium mt-3" variant="secondary">
          {btnTitle}
        </Button>
      </div>
      <Image alt="icon" src={src} />
    </div>
  );
};

export default Banner;
