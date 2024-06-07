'use client';

import React, { FC, useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { ArrowUpDown, ChevronDown, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useSearchParams,
  usePathname,
  useParams,
  useRouter,
} from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TResponseAllCandidates,
  TResponseInvitedUser,
} from '@/lib/validators/interview';
import { formatDateDMY } from '@/helpers';
import { cn } from '@/lib/utils';
import { match } from 'ts-pattern';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INVITED_USER_STATUS } from '@prisma/client';

// name, email added on statu scoring
type TColumn = {
  candidateName: string;
  email: string;
  createdDate: string;
  status?: string;
  score?: number;
};
interface TableDetailProps {
  isEvaluate?: boolean;
  title: string;
  dataSource: TResponseAllCandidates;
}
const TableDetail: FC<TableDetailProps> = ({
  isEvaluate = false,
  title,
  dataSource,
}) => {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { replace, refresh, push } = useRouter();
  const perPage = Number(searchParams.get('per_page') || '10');
  const activePage = Number(searchParams.get('page') || '1');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedAction, setSelectedAction] = useState('SHORTLISTED');

  const columns: ColumnDef<TResponseInvitedUser>[] = useMemo(
    () => [
      {
        accessorKey: 'check',
        header: () => <p></p>,
        size: 10,
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onClick={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              className="w-auto px-4 pl-0 hover:bg-transparent"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Adden on
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <p className="w-auto truncate text-xs text-slate-400">
            {formatDateDMY(row.original.createdAt.toString())}
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
                  score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
            cell: ({ row }) => (
              <p className="w-auto truncate text-sm capitalize text-primary">
                {80}%
              </p>
            ),
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
                    .with(
                      INVITED_USER_STATUS.SHORTLISTED,
                      () => 'text-green-500',
                    )
                    .otherwise(() => 'text-primary'),
                )}
              >
                {row.original.status.toLowerCase()}
              </p>
            ),
          },
    ],
    [isEvaluate],
  );

  const actionList = [
    INVITED_USER_STATUS.SHORTLISTED,
    INVITED_USER_STATUS.REJECTED,
    'DELETE',
  ];

  const table = useReactTable({
    data: dataSource.invitedUsers || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize: perPage,
        pageIndex: 0,
      },
    },
  });
  return (
    <>
      <div className="mt-4 flex w-full items-center justify-between rounded-t-md border px-4">
        <div className="flex items-center gap-2  py-2">
          <div className="mr-3 flex items-center gap-1">
            <Checkbox
              aria-label="Select all"
              className="border-slate-400 bg-white text-black"
              // disabled={true}
              checked={table.getIsAllRowsSelected()}
              onClick={table.getToggleAllRowsSelectedHandler()}
            />
            {!isEvaluate && <p className="text-xs">Select All</p>}
          </div>
          {isEvaluate && (
            <Select onValueChange={(v) => setSelectedAction(v)}>
              <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
                <SelectValue
                  placeholder="Shortlisted"
                  defaultValue="SHORTLISTED"
                />
              </SelectTrigger>

              <SelectContent>
                {actionList.map((action) => (
                  <SelectItem
                    key={action}
                    value={action}
                    className="capitalize"
                  >
                    {action.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            className="h-[30px] px-2 text-xs"
            onClick={() => console.log('action', isEvaluate)}
          >
            {!isEvaluate ? 'Delete' : 'Action'}
          </Button>
        </div>
        <Button
          className="h-[30px] px-2 text-xs"
          onClick={() => console.log('ADD MORE CANDIDATE LINK ROUTE')}
        >
          Add More Candidates
        </Button>
      </div>

      <Table className="border border-solid border-slate-200">
        <TableHeader className="bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-sm font-normal text-black"
                    style={{ width: `${header.getSize()}px !important` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    style={{ width: `${cell.column.getSize()}px !important` }}
                    key={cell.id}
                    className="py-2"
                    onClick={() => console.log('each row' + row.original.id)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableDetail;
