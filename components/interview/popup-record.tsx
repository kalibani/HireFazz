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
import { Button } from '../ui/button';

const PopupRecord = ({
  title,
  triggerName,
  type,
}: {
  title: string;
  triggerName: string;
  type: 'intro' | 'question';
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className="flex items-center gap-x-2 text-sm text-slate-400"
        asChild
      >
        <Button className="gap-x-2" variant="secondary" size="sm">
          {triggerName}
          <Video className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <HrVideo typeVideo={type} />
      </DialogContent>
    </Dialog>
  );
};

export default PopupRecord;
