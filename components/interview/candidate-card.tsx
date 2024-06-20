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
import updateStatusCandidate from '@/lib/actions/interview/updateStatusInvitedCandidates';
import { Loader } from '../share';
import { cn } from '@/lib/utils';
import { useRouter, usePathname, notFound } from 'next/navigation';
import { errorToast, successToast } from '../toasterProvider';
import { match } from 'ts-pattern';

const CandidatesCard = ({
  dataSource,
  index,
}: {
  dataSource: TCandidateListSchema;
  index: number;
}) => {
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const actionHandler = (
    id: string,
    type: 'update' | 'delete' | 'add',
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    startTransition(() => {
      match(type)
        .with(
          'update',
          async () =>
            await updateStatusCandidate(
              id,
              dataSource.status === 'OPEN' ? 'CLOSE' : 'OPEN',
            )
              .then((data) => successToast(data?.success))
              .catch((error) =>
                errorToast(typeof error === 'string' ? error : undefined),
              ),
        )
        .with('add', () => push(`${pathname}/invite-candidates?idInvite=${id}`))
        .otherwise(() => notFound());
    });
  };
  return (
    <>
      <div
        className="my-4 flex min-h-36 flex-col justify-between rounded-md border p-4 hover:cursor-pointer hover:border-primary"
        onClick={() => replace(`${pathname}/${dataSource.id}/invited`)}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-semibold">{dataSource.templateName}</h4>
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
          <div className="my-2 space-y-2">
            <div>
              <p className="text-sm font-semibold text-slate-400">
                {dataSource.companyName || 'Empty Company Name'}
              </p>
              <p className="text-sm text-slate-400">
                {dataSource.templateName}
              </p>
            </div>
            <div className="w-fit rounded-md border p-1.5 text-xs">
              {dataSource.candidatesCount} Candidates
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <CircleEllipsis className="size-8 text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => actionHandler(dataSource.id, 'delete', e)}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => actionHandler(dataSource.id, 'update', e)}
              >
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => actionHandler(dataSource.id, 'add', e)}
              >
                Add Candidates
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
