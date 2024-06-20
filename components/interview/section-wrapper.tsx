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
  // const isLoading = useRecorderStore((state) => state.isLoading);
  return (
    <section className="rounded-md bg-white p-4">
      {/* {isLoading && (
        <div className="fixed left-0 top-0 h-full w-full bg-black/50">
          <Loader />
        </div>
      )} */}
      {children}
    </section>
  );
};

export default SectionWrapLoad;
