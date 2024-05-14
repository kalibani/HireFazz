'use client';

import React from 'react';
import PopupRecord from './popup-record';

const VideoRecord = ({
  videoUrl,
  isEnd = false,
}: {
  videoUrl: Blob | null | undefined;
  isEnd?: boolean;
}) => {
  return (
    <div className="aspec-auto  flex min-h-[200px] w-1/4 flex-col items-center justify-center overflow-hidden rounded-md border">
      {videoUrl && (
        <div className="aspect-video size-full">
          <video controls>
            <source src={URL.createObjectURL(videoUrl)} />
          </video>
        </div>
      )}
      <PopupRecord
        isEnd={isEnd}
        title="Interview Intro"
        triggerName={videoUrl ? 'retake' : 'Add record video'}
      />
    </div>
  );
};

export default VideoRecord;
