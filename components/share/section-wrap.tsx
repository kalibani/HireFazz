import { cn } from '@/lib/utils';
import React from 'react';

const SectionWrap = ({
  children,
  isScroll = false,
  className = '',
}: {
  children: React.ReactNode;
  isScroll?: boolean;
  className?: string
}) => {
  return (
    <section
      className={cn(
        'space-y-3 p-3',
        isScroll ? 'h-[calc(100%-5%)] overflow-y-auto' : '',
        className,
      )}
    >
      {children}
    </section>
  );
};

export default SectionWrap;
