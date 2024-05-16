'use client';
import React, { useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useRecorderStore } from '@/zustand/recordedStore';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { createTemplateInterview } from '@/lib/actions/interview/createTemplateInterview';
import VideoRecord from './video-record';
import { blobToFormData } from '@/lib/utils';
import { uploadVideo } from '@/lib/actions/interview/uploadVideo';
import { errorHandler } from '@/helpers';

const CreateEndInterview = () => {
  const { orgId } = useParams();
  const { replace } = useRouter();
  const {
    title,
    durationTimeAnswered,
    durationTimeRead,
    introVideoUrl,
    questions,
    farewellVideoUrl,
    setIsLoading,
  } = useRecorderStore();
  const [isPending, startTransition] = useTransition();

  const { mutate } = useMutation({
    mutationFn: createTemplateInterview,
    onSuccess: (data) => {
      console.log(data, '<<< on success');
      replace(`/${orgId}/video`);
    },
    onError: (error) => console.log(error, 'error created question'),
  });

  useEffect(() => {
    if (isPending) {
      setIsLoading(isPending);
    }
  }, [isPending, setIsLoading]);

  const submitInterview = () => {
    startTransition(async () => {
      try {
        const payloadQuestions: any = questions.map(async (item) => {
          const urlFormData: any =
            item.videoUrl && (await blobToFormData(item.videoUrl, 'questions'));
          const url = urlFormData && (await uploadVideo(urlFormData));
          return {
            ...item,
            timeAnswered:
              item.timeAnswered === 0
                ? durationTimeAnswered
                : item.timeAnswered,
            timeRead: item.timeRead === 0 ? durationTimeRead : item.timeRead,
            videoUrl: url ?? '',
            description: item.question,
            questionRetake: 0,
          };
        });
        const resolvedQuestions = await Promise.all(payloadQuestions);
        if (orgId) {
          const introVideo =
            introVideoUrl && (await blobToFormData(introVideoUrl, 'intro'));
          const introUrl = introVideo && (await uploadVideo(introVideo));
          const endVideo =
            farewellVideoUrl && (await blobToFormData(farewellVideoUrl, 'end'));
          const endUrl = endVideo && (await uploadVideo(endVideo));
          const payload: any = {
            organizationId: orgId,
            title,
            durationTimeAnswered,
            durationTimeRead,
            introVideoUrl: introUrl,
            farewellVideoUrl: endUrl,
            questions: resolvedQuestions,
          };
          mutate(payload);
          console.log(payload);
        }
      } catch (error) {
        errorHandler(error);
      }
    });
  };
  return (
    <div className=" mb-12 flex flex-col items-center justify-center rounded-md bg-white  p-4">
      <VideoRecord videoUrl={farewellVideoUrl} type="question" />

      <div className="mt-8 flex w-full items-center justify-between">
        <Button>Go Back</Button>
        <Button onClick={submitInterview}>
          {isPending ? '..loading' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default CreateEndInterview;
