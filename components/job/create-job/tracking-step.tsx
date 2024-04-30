import { cn } from '@/lib/utils';
import React from 'react';

const TrackingStep = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center justify-center gap-x-2 rounded-md bg-white py-8 text-xs capitalize">
      <p>Job Details</p>
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 rounded-full bg-red-600" />
        <div
          className={cn(
            'h-[6px] w-80 bg-gray-200 bg-gradient-to-r from-red-600 via-gray-200 transition-all duration-300',
            step !== 0 &&
              ' bg-gradient-to-r from-red-600 via-red-600 to-red-600',
          )}
        />
        <div
          className={cn(
            'h-5 w-5 rounded-full bg-gray-200 transition-all duration-300',
            step > 2 && 'bg-red-600',
          )}
        />
      </div>
      <p>Job Description</p>
    </div>
  );
};

export default TrackingStep;
