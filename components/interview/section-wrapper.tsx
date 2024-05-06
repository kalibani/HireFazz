'use client';
import { cn } from '@/lib/utils';
import { useRecorderStore } from '@/zustand/recordedStore';
import React from 'react';
import { Loader } from '@/components/share';

const SectionWrapLoad = ({
  children,
  isScroll = false,
}: {
  children: React.ReactNode;
  isScroll?: boolean;
}) => {
  const isLoading = useRecorderStore((state) => state.isLoading);
  return (
    <section
      className={cn(
        'space-y-3 p-3',
        isScroll ? 'h-[calc(100%-5%)] overflow-y-auto' : '',
      )}
    >
      {isLoading ? <Loader /> : children}
    </section>
  );
};

export default SectionWrapLoad;
