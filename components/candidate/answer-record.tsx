'use client';
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import Webcam from 'react-webcam';
import { Button } from '../ui/button';
import { PlayCircle, StopCircle } from 'lucide-react';
import {
  audioConstraints,
  blobToFormData,
  cn,
  secondsToTimeString,
  timeStringToSeconds,
  videoConstraints,
} from '@/lib/utils';
import getCandidate from '@/lib/actions/candidate/getCandidate';
import { Loader } from '../share';
import createAnswer from '@/lib/actions/candidate/createAnswer';
import toast from 'react-hot-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { uploadVideo } from '@/lib/actions/interview/uploadVideo';
import updateStatus from '@/lib/actions/candidate/updateStatue';
import checkCandidate from '@/lib/actions/candidate/checkCandidate';
import { sendFromCandidateCompleted } from '@/lib/mail';

interface PropsAnswerRecord {
  timeAnswer: string;
  question: string;
  questionId: string;
  totalQuestion: number;
}

const AnswerRecord: FC<PropsAnswerRecord> = ({
  timeAnswer,
  question,
  questionId,
  totalQuestion,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const id = searchParams.get('id');
  const questionNumber = searchParams.get('question');
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isTriggerStop, setIsTriggetStop] = useState<boolean>(false);
  const [answerTime, setAnswerTime] = useState<number>(
    timeStringToSeconds(timeAnswer),
  );
  const [countdown, setCountdown] = useState<number>(7);
  const [videoSrc, setVideoSrc] = useState<Blob | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDataAvailable = useCallback(
    ({ data }: { data: any }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => [...prev, data]);
      }
    },
    [setRecordedChunks],
  );

  const handleStartCapture = useCallback(() => {
    setCapturing(true);
    setCountdown(0);
    const stream = webcamRef.current?.stream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
    }
  }, [handleDataAvailable, webcamRef, setCapturing, mediaRecorderRef]);

  const handleDownload = useCallback(() => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    setVideoSrc(blob);
  }, [recordedChunks, setVideoSrc]);

  const handleStopCapture = useCallback(() => {
    setCapturing(false);
    setIsTriggetStop(true);
    setAnswerTime(0);
    mediaRecorderRef.current?.stop();
  }, [mediaRecorderRef]);

  const handleNextQuestion = () => {
    startTransition(async () => {
      if (!videoSrc || !id) {
        toast.error('Video source or ID is missing');
        return;
      }
      try {
        const formDataVideo: any = await blobToFormData(videoSrc, 'answered');
        const uploadedVideo = (await uploadVideo(formDataVideo)) as string;

        const response: any = await createAnswer({
          questionId,
          url: uploadedVideo,
          id,
          indexQuestion: Number(questionNumber),
        });

        if (response?.error) {
          toast.error(response.error);
        } else {
          toast.success(response?.success);
        }

        const params = new URLSearchParams(searchParams);
        const questionPart = Number(questionNumber);

        if (totalQuestion - 1 === questionPart) {
          const updateResponse: any = await updateStatus(id);
          if (updateResponse?.error) {
            toast.error(updateResponse.error);
          }
          const candidate = await checkCandidate(id);
          if (candidate?.error) toast.error(candidate.error);

          await sendFromCandidateCompleted(
            candidate?.data?.emailFrom!,
            candidate?.data?.candidateName!,
          );
          toast.success(updateResponse?.success);
          replace('/candidate/finish');
        } else {
          params.set('question', `${questionPart + 1}`);
          params.delete('answer');
          replace(`${pathname}?${params.toString()}`);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      handleDownload();
    }
  }, [recordedChunks, handleDownload]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0 && !capturing) {
      handleStartCapture();
    }
  }, [countdown, capturing, isMounted]);

  useEffect(() => {
    if (capturing && answerTime > 0 && countdown === 0) {
      const interval = setInterval(() => {
        setAnswerTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (answerTime === 0 && capturing && !isTriggerStop) {
      handleStopCapture();
    }
  }, [capturing, answerTime, countdown, isTriggerStop, handleStopCapture]);

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-4xl  overflow-hidden rounded-3xl border bg-slate-600 ">
      <div className="bg-white p-4 text-center text-base font-semibold">
        <h4 className="text-lg text-primary">Question</h4>
        <p>{question}</p>
      </div>

      <div className="flex flex-col items-center justify-center overflow-hidden  p-4">
        <div className="aspect-w-16 aspect-h-9 relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-md">
          {capturing && !videoSrc && (
            <div className="absolute right-0 top-0 z-10 flex flex-col items-end gap-y-2 overflow-hidden rounded-bl-3xl rounded-tr-3xl p-4 shadow-sm backdrop-blur-lg">
              <p className="flex items-center gap-x-2 text-xs text-white">
                <span
                  className={cn(
                    'size-3 rounded-full bg-primary',
                    answerTime <= 10 ? 'animate-ping' : '',
                  )}
                />
                Recording...
              </p>
              <div className="flex items-center text-white">
                <span className="font-bold">
                  {secondsToTimeString(answerTime)}
                </span>
              </div>
            </div>
          )}
          {countdown > 0 && (
            <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-3xl p-4 text-center text-white backdrop-blur-lg backdrop-brightness-50">
              <h4 className="text-7xl font-semibold ">{countdown}</h4>
              <p className="text-sm">Get ready to record your moment!</p>
              <p className="text-xs">
                If the wait feels too long, you can jumpstart the process by
                clicking the play button to begin recording.
              </p>
            </div>
          )}
          {!!videoSrc ? (
            <video
              controls
              src={URL.createObjectURL(videoSrc)}
              className="w-full rounded-md"
            />
          ) : (
            <Webcam
              mirrored
              ref={webcamRef}
              muted={true}
              audioConstraints={audioConstraints}
              videoConstraints={videoConstraints}
              audio
            />
          )}
        </div>
        <div className="my-4 flex justify-center">
          {countdown > 0 && !capturing && (
            <Button
              onClick={handleStartCapture}
              className="h-auto w-fit rounded-full bg-white p-0 hover:bg-white"
              variant="ghost"
            >
              <PlayCircle className="size-8 text-primary" />
            </Button>
          )}
          {capturing && recordedChunks.length === 0 && (
            <Button
              onClick={handleStopCapture}
              className="h-auto w-fit rounded-full bg-white p-0 hover:bg-white"
              variant="ghost"
            >
              <StopCircle className="size-8 text-primary" />
            </Button>
          )}
          {recordedChunks?.length > 0 && (
            <Button onClick={handleNextQuestion} disabled={isPending}>
              {Number(questionNumber) === totalQuestion - 1
                ? 'Next to Save'
                : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
      {isPending && <Loader />}
    </div>
  );
};

export default AnswerRecord;
