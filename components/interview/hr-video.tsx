'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useRecorderStore } from '@/zustand/recordedStore';
import Webcam from 'react-webcam';

import {
  videoConstraints,
  audioConstraints,
  blobToFile,
  blobToFormData,
} from '@/lib/utils';
import { DialogClose } from '../ui/dialog';
import { Clapperboard, Loader2, StopCircle } from 'lucide-react';
import ReactPlayer from 'react-player';

const HrVideo = ({ typeVideo }: { typeVideo: 'intro' | 'question' }) => {
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [preStoreVideo, setPreStoreVideo] = useState<Blob | null>();
  const [isMounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { setVideoUrl, title } = useRecorderStore();
  const [isStarted, setStarted] = useState(false);
  const videoRef = useRef(null);

  const handleDataAvailable = useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks],
  );

  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream instanceof MediaStream) {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
    } else {
      console.error('Webcam is not ready or stream is not available');
    }
  }, [handleDataAvailable, setCapturing, mediaRecorderRef, webcamRef]);

  const handleRetake = () => {
    setStarted(false);
    setCapturing(false);
    setMounted(false);
    setPreStoreVideo(null);
    setRecordedChunks([]);
    setCountdown(5);
  };

  const handleStopCaptureClick = () => {
    if (capturing) {
      mediaRecorderRef.current?.stop();
      setCapturing(false);
    }
  };

  const handleDownload = useCallback(async () => {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });

    const formTheData = await blobToFormData(blob, 'intro');
    setPreStoreVideo(blob);
  }, [recordedChunks]);

  const handleSaveTheRecord = () => {
    if (!preStoreVideo) return;
    setVideoUrl(preStoreVideo, typeVideo);
  };

  useEffect(() => {
    if (countdown > 0 && isStarted) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0 && !capturing) {
      handleStartCaptureClick();
    }
  }, [countdown, capturing, isMounted, handleStartCaptureClick, isStarted]);

  useEffect(() => {
    if (recordedChunks.length > 0) {
      handleDownload();
    }
  }, [recordedChunks, handleDownload]);

  return (
    <div className="flex flex-col  items-center justify-center rounded-md bg-white">
      <div className="relative  overflow-hidden">
        {!isMounted && (
          <div className=" flex size-full flex-col  items-center justify-center rounded-md bg-white">
            <Loader2 className="size-52 animate-spin font-normal text-red-500/20" />
          </div>
        )}

        {capturing && !preStoreVideo && (
          <div className="justify- absolute flex w-full items-center   p-2">
            <p className=" right-2 top-2 z-10 text-xs text-white">
              Recording...
            </p>
          </div>
        )}
        {countdown > 0 && isMounted && (
          <div className="absolute z-10 flex size-full flex-col items-center justify-center text-center text-white backdrop-blur-lg backdrop-brightness-50">
            {!isStarted ? (
              <Button
                className="my-4 gap-2"
                onClick={() => setStarted(true)}
                size="lg"
              >
                <Clapperboard /> Start Record
              </Button>
            ) : (
              <>
                <h4 className="text-7xl font-semibold ">{countdown}</h4>
                <p className="text-sm">Get ready to record your moment!</p>
              </>
            )}
          </div>
        )}
        {!preStoreVideo && (
          <Webcam
            mirrored
            ref={webcamRef}
            muted={true}
            audioConstraints={audioConstraints}
            videoConstraints={videoConstraints}
            width="100%"
            height="100%"
            onUserMedia={(val) => setMounted(val.active)}
            hidden={!isMounted}
            audio
          />
        )}
        {!!preStoreVideo && (
          <>
            <div className=" aspect-video size-full">
              <ReactPlayer
                url={URL.createObjectURL(preStoreVideo)}
                ref={videoRef}
                className="aspect-video"
                width="100%"
                height="100%"
                controls
              />
            </div>
          </>
        )}
      </div>
      <>
        {isStarted && capturing && !preStoreVideo && countdown === 0 && (
          <Button className="my-4 gap-2" onClick={handleStopCaptureClick}>
            <StopCircle />
            Stop
          </Button>
        )}

        {!!preStoreVideo && (
          <div className="my-4 space-x-4">
            <DialogClose asChild>
              <Button className="w-36" onClick={handleSaveTheRecord}>
                Looks good
              </Button>
            </DialogClose>
            <Button className="w-36" onClick={handleRetake}>
              Retake
            </Button>
          </div>
        )}
      </>
      {/* )} */}
    </div>
  );
};

export default HrVideo;
