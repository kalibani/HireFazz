'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const InterviewList = ({ title }: { title: string }) => {
  return (
    <div className="my-4 flex w-full items-center justify-between rounded-lg border p-4 shadow">
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p>Job Name: {title}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Trash2 className="size-5 text-primary" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            alignOffset={0}
            className="flex flex-col gap-y-2 p-2"
          >
            <Button variant="ghost">Edit Question</Button>
            <Button variant="ghost">Preview Question</Button>
            <Button variant="ghost">Close Interview</Button>
            <Button variant="ghost">Result</Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InterviewList;
