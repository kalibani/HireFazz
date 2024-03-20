import Image from 'next/image';
import React from 'react';

interface UnlockProps {
  image: any;
  title: string;
  desc: string;
}

const UnlockCard = ({ image, title, desc }: UnlockProps) => {
  return (
    <div className="mt-16 flex items-center gap-x-10">
      <div className="w-1/2">
        <Image
          alt={`picture-${image}`}
          quality={60}
          src={image}
          height={300}
          width={500}
        />
      </div>
      <div className="w-1/2 space-y-4 text-left">
        <h4 className="text-3xl font-medium">{title}</h4>
        <p className="text-second-text text-lg">{desc}</p>
      </div>
    </div>
  );
};

export default UnlockCard;
