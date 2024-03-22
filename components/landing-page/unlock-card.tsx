import Image from 'next/image';
import React from 'react';

interface UnlockProps {
  image: any;
  title: string;
  desc: string;
}

const UnlockCard = ({ image, title, desc }: UnlockProps) => {
  return (
    <div className="mt-6 flex flex-col-reverse items-center gap-x-10 gap-y-8 md:mt-16 lg:mt-8  lg:flex-row lg:gap-y-10">
      <div className="w-full lg:w-1/2">
        <Image
          alt={`picture-${image}`}
          quality={60}
          src={image}
          className="w-full"
        />
      </div>
      <div className="w-full space-y-2 text-left lg:w-1/2 lg:space-y-4">
        <h4 className="text-xl font-medium xl:text-3xl">{title}</h4>
        <p className="text-sm text-second-text  lg:text-base xl:text-lg">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default UnlockCard;
