'use client';
import { Video } from 'lucide-react';
import React from 'react';
import PopupRecord from './popup-record';
import { Button } from '@/components/ui/button';

const CreateEndInterview = () => {
  return (
    <div className=" mb-12 flex flex-col items-center justify-center rounded-md bg-white  p-4">
      <div className="flex w-1/2 flex-col items-center justify-center overflow-hidden rounded-md border">
        <div className="flex aspect-video min-h-52 flex-col items-center justify-center">
          <p className="text-sm text-slate-200">add video intro</p>
          <Video className="size-10 text-slate-200" />
          <p className="text-xs text-slate-200">Add video record</p>
        </div>
        <PopupRecord title="Interview Intro" triggerName="Add record video" />
      </div>
      <div className="mt-8 flex w-full items-center justify-between">
        <Button>Go Back</Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default CreateEndInterview;
