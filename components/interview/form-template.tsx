'use client';
import React from 'react';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Button } from '../ui/button';
import { FileSpreadsheet } from 'lucide-react';

const FormTemplate = () => {
  const { setFormFirst, introVideoUrl } = useRecorderStore();

  return (
    <div className="mt-5">
      <h3 className="mb-2 text-xl font-semibold">Intro Video</h3>
      <VideoRecord videoUrl={introVideoUrl} />

      <div className="my-4">
        <h4 className="text-xl font-semibold">Notification</h4>
        <div className="flex items-center gap-x-4 text-sm font-normal">
          <p>Send by email</p>
          <Button variant="secondary" className="h-0 p-3 text-sm font-normal">
            Edit Template
          </Button>
        </div>
      </div>
      {/* List questions */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-x-2">
          <FileSpreadsheet className="size-4 text-primary" />
          <h4 className="text-xl font-semibold">Question #1</h4>
        </div>
        <div className="mt-2 flex items-start justify-between">
          <p className="line-clamp-2 max-w-4xl p-0 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <div className="flex gap-x-4">
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs font-normal hover:bg-transparent"
            >
              Preview
            </Button>
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs font-normal hover:bg-transparent"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs font-normal hover:bg-transparent"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTemplate;
