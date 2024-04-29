'use client';

import { Video } from 'lucide-react';
import React from 'react';
import PopupRecord from './popup-record';

const VideoRecord = ({ videoUrl }: { videoUrl: File | null | undefined }) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center overflow-hidden rounded-md border">
      {!videoUrl && (
        <div className="flex aspect-video min-h-52 flex-col items-center justify-center">
          <p className="text-sm text-slate-200">add video intro</p>
          <Video className="size-10 text-slate-200" />
          <p className="text-xs text-slate-200">Add video record</p>
        </div>
      )}
      {videoUrl && (
        <div className="aspect-video size-full">
          <video controls>
            <source src={URL.createObjectURL(videoUrl)} />
          </video>
        </div>
      )}
      <PopupRecord title="Interview Intro" triggerName="Add record video" />
    </div>
  );
};

export default VideoRecord;
