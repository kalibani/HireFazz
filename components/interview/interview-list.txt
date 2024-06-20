'use client';

import React, { useEffect, useTransition } from 'react';
import { Button } from '../ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import deleteTemplate from '@/lib/actions/interview/deleteById';
import { idProps } from '@/lib/validators/interview';
import { z } from 'zod';
import { useRecorderStore } from '@/zustand/recordedStore';
import { errorHandler } from '@/helpers';

const InterviewList = ({ title, id }: { title: string; id: string }) => {
  const [isPending, startTransition] = useTransition();

  const { setIsLoading } = useRecorderStore();
  const { mutate } = useMutation({
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
      mutate({ id });
    });
  };
  return (
    <div className="my-4 flex w-full items-center justify-between rounded-lg  border bg-white p-4">
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-sm font-normal text-slate-400">
          Descriptive of this name interview for detail information
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          onClick={deleteHandler}
        >
          <Trash2 className="size-5 text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewList;
