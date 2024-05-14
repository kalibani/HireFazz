'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import React from 'react';
import HrVideo from './hr-video';
import { Video } from 'lucide-react';

const PopupRecord = ({
  title,
  triggerName,
  isEnd = false,
}: {
  title: string;
  triggerName: string;
  isEnd?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-x-2 text-sm text-slate-400">
        {triggerName}
        <Video />
      </DialogTrigger>
      <DialogContent className="h-fit w-fit">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <HrVideo isEnd={isEnd} />
      </DialogContent>
    </Dialog>
  );
};

export default PopupRecord;
