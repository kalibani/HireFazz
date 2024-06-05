'use client';

import { TimerIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, secondsToTimeString } from '@/lib/utils';

interface TimeDisplayProps {
  timeThinking: string;
  timeAnswer: string;
}

// Helper function to convert HH:MM:SS to seconds
const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString?.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeThinking,
  timeAnswer,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [thinkingTime, setThinkingTime] = useState(
    timeStringToSeconds(timeThinking),
  );

  const nextToAnswerHandle = () => {
    const params = new URLSearchParams(searchParams);
    params.set('answer', `open`);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (thinkingTime <= 0) {
      nextToAnswerHandle();
      return;
    }

    const interval = setInterval(() => {
      setThinkingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [thinkingTime]);

  return (
    <>
      <div
        className={cn(
          'flex items-center',
          thinkingTime <= 10 ? 'animate-bounce' : '',
        )}
      >
        <div className="flex w-48 items-center">
          <span className="text-primary">
            <TimerIcon />
          </span>
          <span className="ml-2 font-semibold text-primary">Time Thinking</span>
        </div>
        <span className="mx-1">:</span>
        <span className="ml-2 font-bold text-primary">
          {secondsToTimeString(thinkingTime)}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        <div className="flex w-48 items-center">
          <span className="text-primary">
            <TimerIcon />
          </span>
          <span className="ml-2 font-semibold text-primary">Time Answer</span>
        </div>
        <span className="mx-1">:</span>
        <span className="ml-2 font-bold">{timeAnswer}</span>
      </div>
      <Button
        className="mt-4 rounded bg-primary px-4 py-2 text-white"
        onClick={nextToAnswerHandle}
      >
        Next to Answer
      </Button>
    </>
  );
};

export default TimeDisplay;
