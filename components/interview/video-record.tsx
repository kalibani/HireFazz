'use client';

import React from 'react';
import PopupRecord from './popup-record';
import { cn } from '@/lib/utils';

const VideoRecord = ({
  videoUrl,
  type,
}: {
  videoUrl: Blob | null | undefined;
  type: 'intro' | 'question';
}) => {
  return (
    <div
      className={cn(
        'flex  w-1/4 flex-col items-center justify-center overflow-hidden rounded-md border',
        videoUrl ? 'h-fit' : 'h-[200px]',
      )}
    >
      {videoUrl && (
        <div className=" aspect-video size-full">
          <video controls>
            <source src={URL.createObjectURL(videoUrl)} />
          </video>
        </div>
      )}
      <PopupRecord
        type={type}
        title="Interview Intro"
        triggerName={videoUrl ? 'retake' : 'Add record video'}
      />
    </div>
  );
};

export default VideoRecord;
