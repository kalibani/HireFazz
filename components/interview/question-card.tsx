'use client';

import { FileSpreadsheet, Search, Redo, Trash2 } from 'lucide-react';
import React, { FC, useTransition } from 'react';
import { Button } from '../ui/button';
import deleteTemplate from '@/lib/actions/interview/deleteById';
import { useMutation } from '@tanstack/react-query';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Loader } from '../share';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import deleteQuestion from '@/lib/actions/interview/deleteQuestion';
import PopupPreviewQuestions from './popup-preview';

interface QuestionCardProp {
  title: string;
  question: string;
  idx: number;
  id?: string;
  videoUrl?: string | undefined;
  type: 'template' | 'questions';
}

const QuestionCard: FC<QuestionCardProp> = ({
  idx,
  question,
  title,
  id,
  videoUrl,
  type,
}) => {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');
  const { push, refresh } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { setIsAddQuestion, setQuestionForm, questions } = useRecorderStore();

  const deleteOneTemplate = useMutation(deleteTemplate, {
    onSuccess() {
      refresh();
    },
  });
  const deleteOneQuestion = useMutation(deleteQuestion, {
    onSuccess() {
      refresh();
    },
  });

  const deleteHandler = () => {
    setIsAddQuestion(false);
    startTransition(() => {
      if (type == 'template' && id) {
        deleteOneTemplate.mutate({ id });
      } else {
        if (id && queryId) {
          deleteOneQuestion.mutate({ id, queryId });
        }
      }
    });
  };

  const editHandler = () => {
    setQuestionForm();
    setIsAddQuestion(false);

    if (type === 'template') {
      if (id) {
        const params = new URLSearchParams(searchParams);
        params.set('id', id);
        push(`${pathname}/create?${params.toString()}`);
      }
    } else {
      setIsAddQuestion(true);
      setQuestionForm({
        videoUrl,
        id,
        title,
        question,
      });
    }
  };
  return (
    <>
      <div className="round my-4  flex w-full gap-x-4 rounded-md border p-4">
        {videoUrl && (
          <div className="h-auto w-[250px] overflow-hidden rounded-md">
            <video controls className="aspect-video size-full rounded-md">
              <source src={videoUrl} />
            </video>
          </div>
        )}
        <div className="flex w-full items-end justify-between ">
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2">
              <FileSpreadsheet className="size-4 text-primary" />
              <h4 className="text-xl font-semibold">Question #{idx + 1}</h4>
            </div>
            <h4 className="my-2 text-xl font-semibold">{title}</h4>
            <p className="line-clamp-2 max-w-4xl p-0 text-sm">{question}</p>
          </div>
          <div className="mt-2 flex items-start justify-between">
            <div className="flex gap-x-4">
              {/* <Button
                variant="ghost"
                className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
                type="button"
                onClick={() => console.log('masuk preview')}
              >
                <Search className="size-3 text-primary" />
                Preview
              </Button> */}
              <PopupPreviewQuestions/>
              <Button
                variant="ghost"
                className="h-auto gap-x-2  p-0 text-xs font-normal hover:bg-transparent"
                onClick={editHandler}
                type="button"
              >
                <Redo className="size-3 text-primary" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
                onClick={deleteHandler}
                type="button"
                disabled={questions.length <= 1 && type === 'questions'}
              >
                <Trash2 className="size-3 text-primary" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isPending && <Loader />}
    </>
  );
};

export default QuestionCard;
