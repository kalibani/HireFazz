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
      <DialogTrigger>{triggerName}</DialogTrigger>
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
