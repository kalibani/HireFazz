'use client';

import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRecorderStore } from '@/zustand/recordedStore';

const InterviewList = () => {
  const {
    setVideoUrl,
    title,
    introVideoUrl,
    farewellVideoUrl,
    durationTimeAnswered,
    durationTimeRead,
  } = useRecorderStore();

  return (
    <div className="mb-8 flex flex-col  items-center justify-center rounded-md bg-white  p-4">
      <Link href="/video/create">
        <Button>Create Interview</Button>
      </Link>
      <div className="my-4 w-full rounded-lg border p-4 shadow">
        <h4 className="text-lg font-bold">Titile of position jon</h4>
        <Button className="mr-4">Delete</Button>
        <Button>Edit</Button>
      </div>
      <div className="flex- mt-10 h-96 flex-col overflow-auto">
        <h1>testing showing</h1>
        <h2>{title}</h2>
        <h2>{durationTimeAnswered}</h2>
        <h2>{durationTimeRead}</h2>

        {introVideoUrl && (
          <div className="flex flex-col">
            <p>intro video shsowinf</p>
            <div className="aspect-video overflow-hidden  rounded-md border">
              <video controls>
                <source src={URL.createObjectURL(introVideoUrl)} />
              </video>
            </div>
          </div>
        )}
        {farewellVideoUrl && (
          <div className="flex flex-col">
            <p>Farewell video shsowinf</p>
            <div className="aspect-video overflow-hidden rounded-md border">
              <video controls>
                <source src={URL.createObjectURL(farewellVideoUrl)} />
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewList;
