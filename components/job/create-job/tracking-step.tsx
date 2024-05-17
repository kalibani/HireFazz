import { cn } from '@/lib/utils';
import React from 'react';

type TitleMap = Record<number, { title: string; subTitle: string }>

const TrackingStep = ({ step, withTitle = true }: { step: number; withTitle?: boolean }) => {
  const titleMap: TitleMap = {
    0: {
      title: 'Create New Job',
      subTitle: ''
    },
    1: {
      title: 'Job Description',
      subTitle: ''
    },
    2: {
      title: 'Upload CV',
      subTitle: 'Please add CV Candidates to add your job list.'
    },
    3: {
      title: 'CV Analyzer',
      subTitle: 'Try to upload and analyze to see our magic'
    }
  }

  const formTitle = titleMap[step]?.title || titleMap[0].title
  const formSubTitle = titleMap[step]?.subTitle || titleMap[0].subTitle

  return (
    <div className="flex items-center justify-between gap-x-2 rounded-md bg-white py-8 text-xs capitalize px-5">
      <div className="flex-1">
        {withTitle && (
          <>
            <h1 className="text-xl font-semibold">{formTitle}</h1>
            <p>{formSubTitle}</p>
          </>
        )}
      </div>
      <div className="flex-1 flex gap-2">
        <p>Job Details</p>
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-red-600" />
          <div
            className="h-[6px] w-80 bg-gray-200"

          >
            <div className={cn(
              'h-full w-1/2 bg-red-600',
              step > 0 && 'w-full'
            )} />
          </div>
          <div
            className={cn(
              'h-5 w-5 rounded-full bg-gray-200 transition-all duration-300',
              step > 0 && 'bg-red-600',
            )}
          />
        </div>
        <p>Job Description</p>
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

export default TrackingStep;
