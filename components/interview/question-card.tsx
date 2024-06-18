'use client';

import { FileSpreadsheet, Redo, Trash2 } from 'lucide-react';
import React, { FC, useCallback, useTransition } from 'react';
import { Button } from '../ui/button';
import deleteTemplate from '@/lib/actions/interview/deleteById';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Loader } from '../share';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import deleteQuestion from '@/lib/actions/interview/deleteQuestion';
import PopupPreviewQuestions from './popup-preview';
import { DeleteDataSchema } from '@/lib/validators/interview';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface QuestionCardProp {
  title: string;
  question: string;
  idx?: number;
  id?: string;
  videoUrl?: any;
  type: 'template' | 'questions';
  isCandidates?: boolean;
  dataSource?: any;
  timeAnswered?: number;
  timeRead?: number;
}

const QuestionCard: FC<QuestionCardProp> = ({
  idx,
  question,
  title,
  id,
  videoUrl,
  type,
  isCandidates = false,
  dataSource,
  timeAnswered,
  timeRead,
}) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const queryId = searchParams.get('id');
  const idInvite = searchParams.get('idInvite');
  const { push, refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setIsAddQuestion, setQuestionForm, removeQuestion, questions } =
    useRecorderStore();

  const deleteTemplateOne = useCallback(
    async (id: string) => {
      const deleted = await deleteTemplate({ id });
      if (deleted && !isPending) {
        refresh();
      }
    },
    [isPending, refresh],
  );

  const deleteOneQuestion = useCallback(
    async (payload: z.infer<typeof DeleteDataSchema>) => {
      try {
        const data: any = await deleteQuestion(payload);

        if (data?.error) {
          toast.error(data.error);
        } else if (data?.success && !isPending) {
          toast.success(data.success);
          refresh();
        }
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        refresh();
      }
    },
    [isPending, refresh],
  );

  const deleteHandler = (index: number) => {
    setIsAddQuestion(false);
    startTransition(() => {
      if (type == 'template' && id) {
        deleteTemplateOne(id);
      } else {
        // if (id && queryId) {
        //   deleteOneQuestion({ id, queryId });
        // }
        removeQuestion(index);
      }
    });
  };

  const editHandler = () => {
    setQuestionForm();
    setIsAddQuestion(false);

    if (type === 'template') {
      if (id) {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('id', id);
        push(`/${params.orgId}/video/create?${queryParams.toString()}`);
      }
    } else {
      setIsAddQuestion(true);
      setQuestionForm({
        videoUrl,
        id,
        title,
        question,
        idx,
        timeAnswered,
        timeRead,
      });
    }
  };
  return (
    <>
      <div className="round my-4  flex w-full gap-x-4 rounded-md border p-4">
        {videoUrl && (
          <div className="h-auto w-[250px] overflow-hidden rounded-md">
            <video controls className="aspect-video size-full rounded-md">
              <source src={videoUrl || URL.createObjectURL(videoUrl)} />
            </video>
          </div>
        )}
        <div className="flex w-full items-end justify-between ">
          <div className="flex w-2/3 flex-col">
            <div className="flex items-center gap-x-2">
              <FileSpreadsheet className="size-4 text-primary" />
              <h4 className="text-xl font-semibold capitalize">
                {!!String(idx) && type !== 'template'
                  ? `${type} #${(idx as number) + 1}`
                  : type}
              </h4>
            </div>
            <h4 className="my-2 text-xl font-semibold">{title}</h4>
            <p className="line-clamp-1 max-w-4xl p-0 text-sm">{question}</p>
            {!!dataSource?.questions && isCandidates && (
              <p className="line-clamp-2 max-w-4xl p-0 text-sm">
                total questions : {dataSource.questions.length}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-start justify-between">
            <div className="flex gap-x-4">
              <PopupPreviewQuestions dataSource={dataSource} />
              {!isCandidates && (
                <>
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
                    onClick={() => deleteHandler(idx || 0)}
                    type="button"
                  >
                    <Trash2 className="size-3 text-primary" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPending && <Loader />}
    </>
  );
};

export default QuestionCard;
