'use client';

import React, { useRef } from 'react';
import PopupRecord from './popup-record';
import { cn } from '@/lib/utils';
import ReactPlayer from 'react-player';
import { useTranslations } from 'next-intl';

const VideoRecord = ({
  videoUrl,
  type,
  className,
}: {
  videoUrl: any;
  type: 'intro' | 'question';
  className?: string;
}) => {
  const videoRef = useRef(null);
  const t = useTranslations('Interview')

  return (
    <div
      className={cn(
        'flex  w-full flex-col items-center justify-center overflow-hidden rounded-md border',
        videoUrl ? 'h-fit' : 'h-[200px]',
        className,
      )}
    >
      {videoUrl && (
        <div className="flex aspect-video w-full items-center justify-center">
          <div className=" aspect-video size-full">
            <ReactPlayer
              url={
                typeof videoUrl === 'string'
                  ? videoUrl
                  : URL.createObjectURL(videoUrl)
              }
              ref={videoRef}
              className="aspect-video"
              width="100%"
              height="100%"
              controls
            />
          </div>
        </div>
      )}
      <div className="p-2">
        <PopupRecord
          type={type}
          title={videoUrl ? t('retakeVideo') : t('addVideo')}
          triggerName={videoUrl ? t('retakeVideo') : t('addVideo')}
        />
      </div>
    </div>
  );
};

export default VideoRecord;
