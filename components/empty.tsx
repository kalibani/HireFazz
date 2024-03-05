import Image from 'next/image';
import React from 'react';

type EmptyProps = {
  label: string;
};

const EmptyPage = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image
          alt="empty"
          fill
          src="/empty.png"
          sizes="100%"
          priority
          quality={50}
        />
      </div>
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};

export default EmptyPage;
