import { Video } from 'lucide-react';
import React from 'react';

const EmptyVideo = () => {
  return (
    <div className="flex h-52 flex-col items-center justify-center rounded-xl border bg-slate-500/50 text-center">
      <p className="text-xl text-white">no video</p>
      <Video className="size-3xl text-white" />
    </div>
  );
};

export default EmptyVideo;
