import { cn } from '@/lib/utils';
import React from 'react';

const SectionWrap = ({
  children,
  isScroll = false,
}: {
  children: React.ReactNode;
  isScroll?: boolean;
}) => {
  return (
    <section
      className={cn(
        'space-y-3 p-3',
        isScroll ? 'h-[calc(100%-5%)] overflow-y-auto' : '',
      )}
    >
      {children}
    </section>
  );
};

export default SectionWrap;
