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
import { utapi } from '@/lib/upload-thing-server';
import file from 'react-player/file';

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

  const handleDownload = useCallback(async () => {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    const file = blobToFile(blob, `${title}-video.webm`);

    const formTheData = await blobToFormData(blob, 'intro');
    const files = formTheData.getAll('file');
    // const fileuploaded = await utapi.uploadFiles(files);
    console.log({ formTheData, blob,files });
    // setRecordedChunks([]);
  }, [recordedChunks]);

  // const upload = async (fileUpload: FormData) => {
  //   'use server'
  //   const fileuploaded = await utapi.uploadFiles(fileUpload);
  //   console.log(fileuploaded, '<<file upload');
  //   return fileuploaded;
  // };

  useEffect(() => {
    if (recordedChunks.length) {
      handleDownload();
      // const blob = new Blob(recordedChunks, {
      // type: 'video/webm',
      // });
      // const url = URL.createObjectURL(blob);
      // const file = blobToFile(blob, `${title}-video.webm`);
      // const formTheData = await blobToFormData(blob,'intro');
      // setRecordedFile(file);
      // upload(file);
      // setVideoUrl(file, isEnd ? 'farewell' : 'intro');
      // setRecordedChunks([]);
      // upload(formTheData);
      // console.log({ file, blob, formTheData }, '<<< file');
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
