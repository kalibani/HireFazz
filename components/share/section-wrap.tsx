import { cn } from '@/lib/utils';
import React from 'react';

const SectionWrap = ({
  children,
  isScroll = false,
  className = '',
}: {
  children: React.ReactNode;
  isScroll?: boolean;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        'space-y-2 p-1.5',
        isScroll ? 'h-full min-h-screen overflow-y-auto' : '',
        className,
      )}
    >
      {children}
    </section>
  );
};

export default SectionWrap;
