'use client';

import { Button } from '@/components/ui/button';
import React, { FC, Fragment, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  MessageSquareText,
} from 'lucide-react';
import {
  type TResponseDetailInterview,
  type TSchemaAddScoring,
} from '@/lib/validators/interview';
import toast from 'react-hot-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import addScoring from '@/lib/actions/interview/score/addScoring';
import { Loader } from '@/components/share';
import HoverComment from './hover-comment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import questions from '@/components/candidate/questions';

interface ICandidate {
  candidate: any;
  orgId: string;
  invitedUserId: string;
  interviewCandidateId: string;
}

const InterviewAnswer: FC<ICandidate> = ({
  candidate,
  orgId,
  invitedUserId,
  interviewCandidateId,
}) => {
  const user = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [score, setScore] = useState<number[]>([0]);
  const [comment, setComment] = useState<string>('');

  const questionIndex = Number(searchParams.get('question'));
  const questions = candidate?.result.questions;

  const handleActionStatus = (type: 'SHORTLISTED' | 'REJECTED') => {};

  const handlerSaveReview = () => {
    if (!score || !comment || !questionIndex) toast.error('Scoring failed');
    startTransition(async () => {
      try {
        const payload: TSchemaAddScoring = {
          comment,
          point: score[0],
          orgId,
          invitedUserId,
          interviewCandidatesId: interviewCandidateId,
          questionId: questions[questionIndex].id,
          reviewerId: user?.id!,
          questionIndex,
        };
        const response = await addScoring(payload);

        if (response?.success) toast.success(response.success);
      } catch (error: any) {
        toast.error(error);
      }
    });
  };

  const handleNavQuestion = (type: 'next' | 'prev') => {
    const params = new URLSearchParams(searchParams);
    params.set('candidateId', `${invitedUserId}`);

    if (type === 'next') {
      params.set('question', `${questionIndex + 1}`);
    } else {
      params.set('question', `${questionIndex - 1}`);
    }

    if (type === 'next' && questionIndex + 1 === questions.length) {
      params.delete('question');
      push(
        `/${orgId}/video/${interviewCandidateId}/evaluation-summary?${params.toString()}`,
        {
          scroll: false,
        },
      );
    } else {
      push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <>
      <div className="flex w-full flex-col-reverse  gap-y-3 overflow-hidden lg:flex-row lg:gap-x-3">
        <div className="flex w-full flex-col gap-y-3 lg:w-[30%] xl:w-[20%]">
          <div className="flex flex-col gap-y-3 rounded-md bg-white p-4">
            <h2 className="text-lg font-semibold text-primary">Candidates</h2>
            <div className="mb-4 flex flex-col justify-between">
              <p className="truncate text-2xl text-red-600">
                {candidate?.candidateName}
              </p>
              <p className="text-sm text-slate-400">
                Email: {candidate?.email}
              </p>
            </div>
            {/* <div className="mb-4 flex justify-between">
              <Button
                className="h-0 p-4 text-xs"
                onClick={() => handleActionStatus('SHORTLISTED')}
              >
                Shortlisted
              </Button>
              <Button
                className="h-0 border-primary p-4 text-xs hover:bg-primary hover:text-white"
                variant="outline"
                onClick={() => handleActionStatus('REJECTED')}
              >
                Rejected
              </Button>
            </div> */}
          </div>

          {!candidate?.scores[questionIndex] && (
            <div className=" flex flex-col gap-y-4 rounded-md bg-white p-4">
              <h3 className="text-lg font-semibold text-primary">
                Your Review
              </h3>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                className={cn('w-[100%]')}
                onValueChange={(value) => setScore(value)}
                value={score}
              />
              <p>score: {score}%</p>
              <Textarea
                className="mt-2 text-gray-500"
                minRows={5}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex w-full justify-end">
                <Button
                  className="right-0 h-0 border-primary p-4 text-xs"
                  onClick={handlerSaveReview}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          <div className=" flex flex-col gap-y-4 rounded-md  bg-white p-4">
            <h3 className="text-lg font-semibold text-primary">Team Review</h3>
            <div className="flex max-h-[138px] flex-col gap-y-2 overflow-y-auto ">
              {candidate?.scores[questionIndex] ? (
                <div className="flex items-center justify-between">
                  <p className="w-1/2 truncate text-sm font-semibold text-gray-700">
                    You
                  </p>
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs font-semibold text-red-600">
                      {candidate?.scores[questionIndex].point}%
                    </p>
                    <HoverComment
                      comment={candidate?.scores[questionIndex].comment}
                    />
                  </div>
                </div>
              ) : (
                <p>empty no reviews</p>
              )}
            </div>
            {/* {candidate?.scores[questionIndex] ? (
                candidate?.scores.map((score) => (
                  <div
                    className="flex items-center justify-between"
                    key={score.id}
                  >
                    {JSON.stringify(score)}
                    <p className="w-1/2 truncate text-sm font-semibold text-gray-700">
                      {score.reviewer.id === user?.id
                        ? 'You'
                        : score.reviewer.name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <p className="text-xs font-semibold text-red-600">
                        {score.point}%
                      </p>
                      <HoverComment comment={score.comment} />
                    </div>
                  </div>
                ))
              ) : (
                <p>empty no reviews</p>
              )}
            </div> */}
          </div>
        </div>

        {/* <!-- Main Content --> */}
        <div className="flex w-full flex-col gap-y-3  lg:w-[70%] xl:w-[80%]">
          <div className="flex gap-x-3">
            <Button
              className={cn(
                'h-auto w-fit bg-white text-slate-400 hover:text-white xl:w-72',
                questionIndex > questions.length && 'bg-primary text-white',
              )}
              disabled={questionIndex === 0}
              onClick={() => handleNavQuestion('prev')}
            >
              <ArrowLeft className="xl:mr-2 xl:size-4" />
              <span className="hidden xl:block">Previous Question</span>
            </Button>
            <div className=" flex w-full flex-col items-center justify-center rounded-md bg-white py-1 text-center">
              <p className="flex items-center gap-1 text-sm">
                <MessageSquareText className="size-3 text-primary" /> Answer{' '}
                {questionIndex + 1} of {questions?.length}
              </p>
              <h3 className="text-2xl font-semibold text-primary">
                {questions[questionIndex]?.title} #{questionIndex + 1}
              </h3>
            </div>

            <Button
              className={cn(
                'h-auto w-fit bg-white text-slate-400 hover:text-white xl:w-72',
                questionIndex < questions.length && 'bg-primary text-white',
              )}
              onClick={() => handleNavQuestion('next')}
            >
              <span className="hidden xl:block">
                {questionIndex + 1 !== questions.length
                  ? 'Next Question'
                  : 'Next Result'}
              </span>
              <ArrowRight className="xl:mr-2 xl:size-4" />
            </Button>
          </div>

          <div className="flex gap-x-3 ">
            <div className="aspect-video w-full rounded-md bg-white p-4">
              <video
                key={questionIndex}
                className="mx-auto aspect-video size-full rounded-md shadow-lg"
                controls
              >
                <source
                  src={questions[questionIndex].answered}
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="flex w-[600px] flex-col rounded-md bg-white p-4">
              <h4 className="text-lg font-bold text-primary">
                {questions[questionIndex]?.title} #{questionIndex + 1}
              </h4>
              <p className="my-4 text-sm text-second-text">
                {questions[questionIndex]?.question}
              </p>
            </div>
          </div>

          <div className="flex gap-x-3">
            <div className="flex h-48 w-1/2 items-center justify-center gap-3 rounded-md bg-white">
              <div className="w-fit rounded-md bg-primary p-2">
                <LockKeyhole className=" text-white" />{' '}
              </div>
              <p className="text-lg font-bold">Fitur akan segera hadir</p>
            </div>
            <div className="flex h-48 w-1/2 items-center justify-center gap-3 rounded-md bg-white">
              <div className="w-fit rounded-md bg-primary p-2">
                <LockKeyhole className=" text-white" />{' '}
              </div>
              <p className="text-lg font-bold">Fitur akan segera hadir</p>
            </div>
          </div>
        </div>
      </div>
      {isPending && <Loader />}
    </>
  );
};

export default InterviewAnswer;
