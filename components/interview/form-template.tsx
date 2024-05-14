'use client';
import React from 'react';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';

const FormTemplate = () => {
  const { setFormFirst, introVideoUrl } = useRecorderStore();

  return (
    <div className="mt-5">
      <h3 className="mb-2 text-xl font-semibold">Intro Video</h3>
      <VideoRecord videoUrl={introVideoUrl} />
    </div>
  );
};

export default FormTemplate;
