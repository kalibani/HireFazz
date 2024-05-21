'use client';

import { FileSpreadsheet, Search, Redo, Trash2 } from 'lucide-react';
import React, { FC, useEffect, useTransition } from 'react';
import { Button } from '../ui/button';
import { errorHandler } from '@/helpers';
import deleteTemplate from '@/lib/actions/interview/deleteById';
import { idProps } from '@/lib/validators/interview';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useRecorderStore } from '@/zustand/recordedStore';

interface QuestionCardProp {
  title: string;
  question: string;
  idx: number;
  id?: string;
  type: 'template' | 'questions';
}

const QuestionCard: FC<QuestionCardProp> = ({
  idx,
  question,
  title,
  id,
  type,
}) => {
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useRecorderStore();

  const { mutate: mutateDeleteTemplate } = useMutation({
    mutationKey: ['delete-template'],
    mutationFn: (id: z.infer<typeof idProps>) => deleteTemplate(id),
    onSuccess() {
      setIsLoading(false);
    },
    onError(error) {
      setIsLoading(false);
      errorHandler(error);
    },
  });

  useEffect(() => {
    if (isPending) {
      setIsLoading(isPending);
    }
  }, [isPending, setIsLoading]);

  const deleteHandler = () => {
    startTransition(() => {
      if (type == 'template' && id) {
        mutateDeleteTemplate({ id });
      }
    });
  };
  return (
    <div className="my-4 rounded-lg border p-4">
      <div className="flex items-center gap-x-2">
        <FileSpreadsheet className="size-4 text-primary" />
        <h4 className="text-xl font-semibold">Question #{idx + 1}</h4>
      </div>
      <h4 className="my-2 text-xl font-semibold">{title}</h4>
      <div className="mt-2 flex items-start justify-between">
        <p className="line-clamp-2 max-w-4xl p-0 text-sm">{question}</p>
        <div className="flex gap-x-4">
          <Button
            variant="ghost"
            className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
          >
            <Search className="size-3 text-primary" />
            Preview
          </Button>
          <Button
            variant="ghost"
            className="h-auto gap-x-2  p-0 text-xs font-normal hover:bg-transparent"
          >
            <Redo className="size-3 text-primary" />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="h-auto gap-x-2 p-0 text-xs font-normal hover:bg-transparent"
            onClick={deleteHandler}
          >
            <Trash2 className="size-3 text-primary" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
