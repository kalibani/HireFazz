'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useRecorderStore } from '@/zustand/recordedStore';
import Webcam from 'react-webcam';
import { videoConstraints, audioConstraints, blobToFile } from '@/lib/utils';

const HrVideo = ({ isEnd = false }: { isEnd: boolean }) => {
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { setVideoUrl, title } = useRecorderStore();

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
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current?.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });

      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const file = blobToFile(blob, `${title}-video.webm`);
      // setRecordedFile(file);
      setVideoUrl(file, isEnd ? 'farewell' : 'intro');
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <div className="mb-8 flex flex-col  items-center justify-center rounded-md bg-white  p-4">
      <div className="relative w-full overflow-hidden rounded-lg border-2">
        {capturing && (
          <p className="absolute right-2 top-2 z-10 text-xs text-white">
            Recording...
          </p>
        )}
        <Webcam
          mirrored
          ref={webcamRef}
          muted={true}
          audioConstraints={audioConstraints}
          videoConstraints={videoConstraints}
          audio
        />
      </div>
      {capturing ? (
        <Button className="mt-10" onClick={handleStopCaptureClick}>
          Stop
        </Button>
      ) : (
        <Button className="mt-10" onClick={handleStartCaptureClick}>
          Start
        </Button>
      )}
    </div>
  );
};

export default HrVideo;
