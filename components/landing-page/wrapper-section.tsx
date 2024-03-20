import { cn } from '@/lib/utils';
import React from 'react';

const WrapperSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <section className={cn('mx-auto h-full w-full max-w-screen-xl', className)}>
      {children}
    </section>
  );
};

export default WrapperSection;
