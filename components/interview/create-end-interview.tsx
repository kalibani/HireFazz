'use client';
import { Video } from 'lucide-react';
import React from 'react';
import PopupRecord from './popup-record';
import { Button } from '@/components/ui/button';
import { useRecorderStore } from '@/zustand/recordedStore';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { createTemplateInterview } from '@/lib/actions/interview/createTemplateInterview';

const CreateEndInterview = () => {
  const { orgId } = useParams();
  const {
    title,
    durationTimeAnswered,
    durationTimeRead,
    introVideoUrl,
    questions,
  } = useRecorderStore();
  const { mutate } = useMutation({ mutationFn: createTemplateInterview });

  const submitInterview = () => {
    const payloadQuestions = questions.map((item) => ({
      ...item,
      timeAnswered:
        item.timeAnswered === 0 ? durationTimeAnswered : item.timeAnswered,
      timeRead: item.timeRead === 0 ? durationTimeRead : item.timeRead,
    }));
    if (orgId) {
      const payload = {
        payloadQuestions,
        title,
        durationTimeAnswered,
        durationTimeRead,
        introVideoUrl,
        orgId,
      };
      // mutate(payload);
    }
  };
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
        <Button onClick={submitInterview}>Submit</Button>
      </div>
    </div>
  );
};

export default CreateEndInterview;
