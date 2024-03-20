import Image from 'next/image';
import React from 'react';

interface UnlockProps {
  image: any;
  title: string;
  desc: string;
}

const UnlockCard = ({ image, title, desc }: UnlockProps) => {
  return (
    <div className="mt-8 flex flex-col-reverse items-center gap-x-10 gap-y-10  md:mt-16 lg:flex-row">
      <div className="w-full lg:w-1/2">
        <Image
          alt={`picture-${image}`}
          quality={60}
          src={image}
          className="w-full object-fill"
        />
      </div>
      <div className="w-full space-y-4 text-left lg:w-1/2">
        <h4 className="text-3xl font-medium">{title}</h4>
        <p className="text-second-text text-lg">{desc}</p>
      </div>
    </div>
  );
};

export default UnlockCard;
