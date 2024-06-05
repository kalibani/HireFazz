'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecorderStore } from '@/zustand/recordedStore';
import Webcam from 'react-webcam';
import {
  audioConstraints,
  blobToFile,
  cn,
  videoConstraints,
} from '@/lib/utils';
import { Button } from '../ui/button';

const CandidateView = () => {
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { recordedFile, texts, setListResult, listResult } = useRecorderStore();

  const [remainingTime, setRemainingTime] = useState(11); //  minutes in seconds
  const [readTime, setReadTime] = useState(5); //  minutes in seconds

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      setReadTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          handleStartCaptureClick();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const file = blobToFile(blob, 'video.webm');
      setListResult({ file, question: 'text hardcode dulu' });
      setRecordedChunks([]);
    }
  }, [recordedChunks, setListResult]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (capturing) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            handleStopCaptureClick();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [capturing, handleStopCaptureClick]);

  const handleDataAvailable = useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
    }
  }, [handleDataAvailable]);

  console.log(recordedFile, '<<<');
  return (
    <div className="mb-8 flex flex-col items-center justify-center rounded-md bg-white p-4">
      <p>jumlah pertanya: {texts?.length} </p>
      <div className="flex items-end gap-x-6">
        <div
          className={cn(
            'w-1/2 overflow-hidden rounded-lg border-2 border-slate-400',
            remainingTime <= 10 && 'animate-pulse border-red-600',
            remainingTime === 0 && 'animate-none border-green-600',
          )}
        >
          <Webcam
            audioConstraints={audioConstraints}
            videoConstraints={videoConstraints}
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-red-600">Time</h4>
              <p>{formatTime(remainingTime)}</p>
            </div>
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-red-600">
                Read Question Time
              </h4>
              <p>{formatTime(readTime)}</p>
            </div>
          </div>
          <h4 className="text-xl font-bold text-red-600">Question {1}</h4>
          <p className="">Sebutkan penyebab kenapa kamu ganteng ?</p>
          <div>
            {capturing ? (
              <Button className="mt-10" onClick={handleStopCaptureClick}>
                Next
              </Button>
            ) : (
              <Button className="mt-10" onClick={handleStartCaptureClick}>
                Start
              </Button>
            )}
          </div>
        </div>
      </div>
      <div>
        {recordedFile && (
          <video controls>
            <source src={URL.createObjectURL(recordedFile)} />
          </video>
        )}
      </div>
    </div>
  );
};

export default CandidateView;

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
