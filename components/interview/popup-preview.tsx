'use client';

import { Search, MessageCircleQuestion, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const PopupPreviewQuestions = ({ dataSource }: { dataSource?: any }) => {
  const [indexOfQuestion, setIndexOfQuestion] = useState(0);
  console.log(dataSource, '<<<<< ???');

  const indexContentHAndler = (index: number) => {
    console.log(index);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
          type="button"
        >
          <Search className="size-3 text-primary" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="border-b py-4">
          <DialogTitle className="text-center text-xl font-semibold">
            Preview Interview Question
          </DialogTitle>
        </DialogHeader>
        <div className="flex  w-full justify-between space-x-2">
          <div className="space-y-2">
            <h4 className="flex items-center gap-x-2 text-xl font-semibold text-primary">
              <MessageCircleQuestion />
              List Question
            </h4>
            <div className="flex flex-col gap-y-2">
              <Button className={cn('h-0 w-fit p-4')} variant="ghost">
                Intro
              </Button>
              {dataSource?.questions.map((question, idx) => (
                <Button
                  key={question.id}
                  className={cn('h-0 w-fit p-4')}
                  variant="default"
                  onClick={() => indexContentHAndler(idx)}
                >
                  Question #{idx + 1}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex  w-1/3 flex-col gap-y-2 ">
            <h4 className="flex items-center gap-x-2 text-xl font-semibold text-primary">
              <FileText />
              Question 1 of {dataSource?.questions.length}
            </h4>
            <div className="mt-4 font-normal">
              <p className="text-sm text-primary">Title Question</p>
              <p className="mt-1 text-xs">{dataSource.questions[0].title}</p>
            </div>
            <div className="mt-4 font-normal">
              <p className="text-sm text-primary">Detail Question</p>
              <p className="mt-1 text-xs">{dataSource.questions[0].question}</p>
            </div>
            <div className="mt-4 font-normal">
              <p className="text-sm text-primary">Time</p>
              <p className="mt-1 text-xs">Time to Think : 30 Seconds</p>
              <p className="mt-1 text-xs">Time to Answer : 30 Seconds</p>
            </div>
          </div>
          <div className="size-full w-1/4">
            {dataSource.questions[0].videoUrl && (
              <div className="flex aspect-video  overflow-hidden rounded-md">
                <video controls className="rounded-md">
                  <source src={dataSource.questions[0].videoUrl} />
                </video>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupPreviewQuestions;
