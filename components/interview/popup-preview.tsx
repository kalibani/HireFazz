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

interface PropsDataSource {
  description?: string;
  descriptionIntro?: string;
  introVideoUrl?: string;
  durationTimeAnswered: number;
  durationTimeRead: number;
  id: string;
  title: string;
  questions: [
    {
      id: string;
      question: string;
      timeAnswered: number;
      timeRead: number;
      title: number;
      videoUrl?: string;
    },
  ];
}

const PopupPreviewQuestions = ({
  dataSource,
}: {
  dataSource?: PropsDataSource;
}) => {
  const [listQuestion, setListQuestion] = useState<number>(0);

  const indexContentHAndler = (index: number) => {
    setListQuestion(index);
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
          <div className="flex flex-col gap-y-2">
            <h4 className="flex items-center gap-x-2 text-xl font-semibold text-primary">
              <MessageCircleQuestion />
              List Question
            </h4>
            <div className="mt-4 flex flex-col gap-y-2">
              <Button
                className={cn('h-0 w-fit p-4')}
                variant={listQuestion === 0 ? 'default' : 'ghost'}
                onClick={() => indexContentHAndler(0)}
              >
                Intro
              </Button>
              {dataSource?.questions.map((question, idx: number) => (
                <Button
                  key={question.id}
                  className={cn('h-0 w-fit p-4')}
                  variant={listQuestion === idx + 1 ? 'default' : 'ghost'}
                  onClick={() => indexContentHAndler(idx + 1)}
                >
                  Question #{idx + 1}
                </Button>
              ))}
            </div>
          </div>
          {listQuestion !== 0 && (
            <div className="flex  w-1/3 flex-col gap-y-2 ">
              <h4 className="flex items-center gap-x-2 text-xl font-semibold text-primary">
                <FileText />
                Question {listQuestion} of {dataSource?.questions.length}
              </h4>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Title Question</p>
                <p className="mt-1 text-xs">
                  {dataSource?.questions[listQuestion - 1].title}
                </p>
              </div>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Detail Question</p>
                <p className="mt-1 text-xs">
                  {dataSource?.questions[listQuestion - 1].question}
                </p>
              </div>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Time</p>
                <p className="mt-1 text-xs">
                  Time to Think :
                  {dataSource?.questions[listQuestion - 1].timeRead} Seconds
                </p>
                <p className="mt-1 text-xs">
                  Time to Answer :{' '}
                  {dataSource?.questions[listQuestion - 1].timeAnswered} Seconds
                </p>
              </div>
            </div>
          )}
          {listQuestion === 0 && (
            <div className="flex  w-1/3 flex-col gap-y-2 ">
              <h4 className="flex items-center gap-x-2 text-xl font-semibold text-primary">
                Intro
              </h4>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Title Intro</p>
                <p className="mt-1 text-xs">{dataSource?.title}</p>
              </div>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Detail Question</p>
                <p className="mt-1 text-xs">{dataSource?.descriptionIntro}</p>
              </div>
              <div className="mt-4 font-normal">
                <p className="text-sm text-primary">Time</p>
                <p className="mt-1 text-xs">
                  Time to Think : {dataSource?.durationTimeRead} Seconds
                </p>
                <p className="mt-1 text-xs">
                  Time to Answer : {dataSource?.durationTimeAnswered} Seconds
                </p>
              </div>
            </div>
          )}

          <div className="size-full w-1/4">
            {listQuestion !== 0 &&
              dataSource?.questions[listQuestion - 1]?.videoUrl && (
                <div className="flex aspect-video  overflow-hidden rounded-md">
                  <video controls className="rounded-md">
                    <source
                      src={dataSource?.questions[listQuestion - 1]?.videoUrl}
                    />
                  </video>
                </div>
              )}
            {listQuestion === 0 && (
              <div className="flex aspect-video  overflow-hidden rounded-md">
                <video controls className="rounded-md">
                  <source src={dataSource?.introVideoUrl} />
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
