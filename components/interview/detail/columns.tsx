'use client';

import header from '@/components/auth/header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateAverage, formatDateDMY } from '@/helpers';
import { cn } from '@/lib/utils';
import { TResponseInvitedUser } from '@/lib/validators/interview';
import { INVITED_USER_STATUS } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { match } from 'ts-pattern';

const columnsTable = (isEvaluate: boolean = false) => {
  const columns: ColumnDef<TResponseInvitedUser>[] = [
    {
      accessorKey: 'check',
      header: () => <p></p>,
      size: 10,
      cell: ({ row }) => {
        return (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              onCheckedChange: row.getToggleSelectedHandler(),
            }}
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="w-auto px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-auto truncate text-sm capitalize">
          {row.original.candidateName}
        </p>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            className="w-auto px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-auto truncate text-xs text-slate-400">
          {row.original.email}
        </p>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            className="w-auto px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Adden on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-auto truncate text-xs text-slate-400">
          {formatDateDMY(row.original?.createdAt?.toString())}
        </p>
      ),
    },
    isEvaluate
      ? {
          accessorKey: 'score',
          header: ({ column }) => {
            return (
              <Button
                className="w-auto px-4 pl-0 hover:bg-transparent"
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
              >
                Score
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => {
            //@ts-ignore
            const scores = row.original?.scores || [];
            const points = scores.map((item: any) => item.point) as number[];
            return (
              <p className="w-auto truncate text-sm capitalize text-primary">
                {calculateAverage(points) || 0}%
              </p>
            );
          },
        }
      : {
          accessorKey: 'status',
          header: ({ column }) => {
            return (
              <Button
                className="w-auto px-4 pl-0 hover:bg-transparent"
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }) => (
            <p
              className={cn(
                'w-auto truncate text-xs capitalize text-slate-400',
                match(row.original.status)
                  .with(INVITED_USER_STATUS.INVITED, () => 'text-blue-500')
                  .with(INVITED_USER_STATUS.SHORTLISTED, () => 'text-green-500')
                  .otherwise(() => 'text-primary'),
              )}
            >
              {row.original.status.toLowerCase()}
            </p>
          ),
        },
  ];
  return columns;
};

export default columnsTable;
