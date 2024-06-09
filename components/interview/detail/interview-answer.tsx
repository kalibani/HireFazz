'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, MessageSquareText } from 'lucide-react';
import ComingSoon from '@/components/coming-soon';

const InterviewAnswer = () => {
  const [score, setScore] = useState<number[]>([0]);
  return (
    <div className="flex w-full flex-col-reverse  gap-y-3 overflow-hidden lg:flex-row lg:gap-x-3">
      <div className="flex w-full flex-col gap-y-3 lg:w-[30%] xl:w-[20%]">
        <div className="flex flex-col gap-y-3 rounded-md bg-white p-4">
          <h2 className="text-lg font-semibold text-primary">Candidates</h2>
          <div className="mb-4 flex flex-col justify-between">
            <p className="text-2xl text-red-600 ">James Curtis</p>
            <p className="text-sm text-slate-400">Email: namanda@gmail.com</p>
          </div>
          <div className="mb-4 flex justify-between">
            <Button className="h-0 p-4 text-xs">Shortlisted</Button>
            <Button
              className="h-0 border-primary p-4 text-xs hover:bg-primary hover:text-white"
              variant="outline"
            >
              Rejected
            </Button>
          </div>
        </div>

        <div className=" flex flex-col gap-y-4 rounded-md bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Your Review</h3>
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            className={cn('w-[100%]')}
            onValueChange={(value) => setScore(value)}
            value={score}
          />
          <p>score: {score}%</p>
          <Textarea className="mt-2 text-gray-500" minRows={5}>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry.
          </Textarea>
          <div className="flex w-full justify-end">
            <Button className="right-0 h-0 border-primary p-4 text-xs">
              Save
            </Button>
          </div>
        </div>

        <div className=" flex flex-col gap-y-4 rounded-md  bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Your Review</h3>
          <div className="flex max-h-[138px] flex-col gap-y-2 overflow-y-auto ">
            <div className="flex items-center justify-between">
              <p className="w-1/2 truncate text-sm font-semibold text-gray-700">
                Dimas Novan Arif Wicaksono
              </p>
              <div className="flex gap-x-2">
                <span className=" text-xs font-semibold text-red-600">80%</span>
                <span className="text-xs text-blue-500">comment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Main Content --> */}
      <div className="flex w-full flex-col gap-y-3  lg:w-[70%] xl:w-[80%]">
        <div className="flex gap-x-3">
          <Button className="h-auto w-fit bg-white text-slate-400 hover:text-white xl:w-72">
            <ArrowLeft className="xl:mr-2 xl:size-4" />
            <span className="hidden xl:block">Previous Question</span>
          </Button>
          <div className=" flex w-full flex-col items-center justify-center rounded-md bg-white py-1 text-center">
            <p className="flex items-center gap-1 text-sm">
              <MessageSquareText className="size-3 text-primary" /> Answer 1 of
              10
            </p>
            <h3 className="text-2xl font-semibold text-primary">
              This is Title Question #1
            </h3>
          </div>

          <Button className="h-auto w-fit bg-white text-slate-400 hover:text-white xl:w-72">
            <span className="hidden xl:block">Next Question</span>
            <ArrowRight className="xl:mr-2 xl:size-4" />
          </Button>
        </div>

        <div className="flex gap-x-3 ">
          <div className="aspect-video w-full rounded-md bg-white p-4">
            <video
              className="mx-auto aspect-video size-full rounded-md shadow-lg"
              controls
            >
              <source src="path-to-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex w-[600px] flex-col rounded-md bg-white p-4">
            <h4 className="text-lg font-bold text-primary">
              This is Title Question #1
            </h4>
            <p className="my-4 text-sm text-second-text">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry.
            </p>
          </div>
        </div>

        <div className="flex h-72 flex-col items-center justify-center gap-y-2 rounded-md bg-white p-4">
          <h1 className="text-center text-5xl font-extrabold lg:text-7xl 2xl:text-8xl">
            <span className="bg-gradient-to-br from-teal-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
              Coming
            </span>

            <span className="bg-gradient-to-tr from-blue-500 via-pink-500 to-red-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
              {' '}
              Soon
            </span>
          </h1>
          <p className="text-gray-600">
            AI-Powered Scoring - Reduce Your Time, Maximize Your Insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnswer;
