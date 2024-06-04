import { Video } from 'lucide-react';
import React from 'react';

const EmptyVideo = () => {
  return (
    <div className=" flex aspect-video h-64 flex-col items-center justify-center overflow-hidden rounded-xl border bg-slate-500/50">
      <p className="text-xl text-white">no video</p>
      <Video className="size-20 font-bold text-white" />
    </div>
  );
};

export default EmptyVideo;
