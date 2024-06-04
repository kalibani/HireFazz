'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../ui/button';
import { PlayCircle, StopCircle } from 'lucide-react';
import {
  audioConstraints,
  cn,
  secondsToTimeString,
  timeStringToSeconds,
  videoConstraints,
} from '@/lib/utils';

interface PropsAnswerRecord {
  timeAnswer: string;
}

const AnswerRecord: FC<PropsAnswerRecord> = ({ timeAnswer }) => {
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleDataAvailable = useCallback(
    ({ data }: { data: any }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => [...prev, data]);
      }
    },
    [setRecordedChunks],
  );

  const handleStartCapture = useCallback(() => {
    setVideoSrc(null);
    setCapturing(true);
    setCountdown(0);
    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();
  }, [handleDataAvailable]);

  const handleDownload = useCallback(async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    console.log({ blob, url });
    setVideoSrc(url);
  }, [recordedChunks]);

  const handleStopCapture = useCallback(() => {
    setCapturing(false);
    setIsTriggetStop(true);
    setAnswerTime(0);
    mediaRecorderRef.current?.stop();
    handleDownload();
  }, [handleDownload]);

  const handleNextQuestion = () => {
    console.log({ videoSrc });
    // const params = new URLSearchParams(searchParams);
    // params.set('answer', `open`);
    // replace(`${pathname}?${params.toString()}`);
  };

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
  }, [capturing, answerTime, countdown, isTriggerStop]);

  if (!isMounted) return null;

  console.log({ recordedChunks });

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="aspect-w-16 aspect-h-9 relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-md">
        {capturing && (
          <div className="absolute right-0 top-0 z-10 flex flex-col items-end gap-y-2 rounded-bl-3xl p-4 shadow-sm backdrop-blur-lg">
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
          <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center p-4 text-center text-white backdrop-blur-lg backdrop-brightness-50">
            <h4 className="text-7xl font-semibold ">{countdown}</h4>
            <p className="text-sm">Get ready to record your moment!</p>
            <p className="text-xs">
              If the wait feels too long, you can jumpstart the process by
              clicking the play button to begin recording.
            </p>
          </div>
        )}
        {videoSrc ? (
          <video controls src={videoSrc} className="w-full rounded-md" />
        ) : (
          <Webcam
            mirrored
            ref={webcamRef}
            muted
            audioConstraints={audioConstraints}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
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
          <Button onClick={handleNextQuestion}>Next Question</Button>
        )}
      </div>
    </div>
  );
};

export default AnswerRecord;

