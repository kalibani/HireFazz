'use client';

import { TCandidateListSchema } from '@/lib/validators/interview';
import { Flag, CircleEllipsis } from 'lucide-react';
import React, { useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import updateStatusCandidate from '@/lib/actions/interview/updateStatusCandidates';
import { Loader } from '../share';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

const CandidatesCard = ({
  dataSource,
  index,
}: {
  dataSource: TCandidateListSchema;
  index: number;
}) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const updateStatusHandler = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      updateStatusCandidate(id, dataSource.status === 'OPEN' ? 'CLOSE' : 'OPEN')
        .then((data) => console.log(data?.success, 'masuk'))
        .catch((error) => console.log(error));
    });
  };
  return (
    <>
      <div
        className="my-4 flex min-h-36 flex-col justify-between rounded-md border p-4 hover:cursor-pointer hover:border-primary"
        onClick={() => replace(`${pathname}/${dataSource.id}`)}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-semibold">
            {dataSource.name} Candidates # {index + 1}
          </h4>
          <div
            className={cn(
              'flex items-center gap-x-2 text-sm font-bold ',
              dataSource.status === 'OPEN' ? 'text-green-500' : 'text-primary',
            )}
          >
            <Flag className="size-4" />
            <p className="capitalize">Status: {dataSource.status} </p>
          </div>
        </div>
        <div className="flex items-start  justify-between">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">{dataSource.templateName}</p>
            <div className="w-fit rounded-md border p-1.5 text-xs">
              {dataSource.candidatesCount} Candidates
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <CircleEllipsis className="text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => updateStatusHandler(dataSource.id, e)}
              >
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isPending && <Loader />}
      </div>
    </>
  );
};

export default CandidatesCard;
