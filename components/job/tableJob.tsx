'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { PaginationGroup } from '../ui/pagination';
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
import { Button } from '../ui/button';
import { formatDateDMY } from '@/helpers';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GetJobListData } from '@/lib/actions/job/getJob';
import { useTranslations } from 'next-intl';

interface TableJobProps {
  orgId: string;
  jobData?: GetJobListData;
}

export const TableJob: React.FC<TableJobProps> = ({ orgId, jobData }) => {
  const searchParams = useSearchParams();
  const perPage = searchParams.get('per_page');
  const currPage = searchParams.get('page');
  const pathname = usePathname();
  const { replace } = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const t = useTranslations('JobList');

  const pageSize = Number(perPage || 10);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'jobName',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_jobLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize">{row.getValue('jobName')}</p>
      ),
    },
    {
      accessorKey: 'candidates',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_candidateLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">
          {row.getValue('candidates')}
        </p>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_createdAtLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">
          {formatDateDMY(row.getValue('createdAt'))}
        </p>
      ),
    },
    {
      accessorKey: 'shortlisted',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_shortlistedLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">
            {row.getValue('shortlisted')}
          </p>
        );
      },
    },
    {
      accessorKey: 'companyName',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_companyLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">
            {row.getValue('companyName')}
          </p>
        );
      },
    },
    {
      id: 'status',
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('table_statusLabel')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Button variant="ghost" className="hover:bg-transparent">
            <p className="capitalize text-slate-400">{row.original.status}</p>
          </Button>
        );
      },
    },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/${orgId}/job/${row.original.id}/all-applicant`}
              className="font-medium text-red-500 underline"
            >
              {t('table_seeMoreCta')}
            </Link>
            <MoreVertical />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: jobData?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: jobData?.data.length,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);

      // set page to 1 if change item in page
      if (query === 'per_page') {
        params.set('page', '1');
      }
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mt-4">
      <Table className="border">
        <TableHeader className="bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-sm font-normal text-black"
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
                  <TableCell key={cell.id} className="py-2">
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

      <PaginationGroup
        perPage={pageSize}
        totalItems={jobData?.totalItems || 0}
        activePage={Number(currPage)}
        handlePagination={handlePagination}
      />
    </div>
  );
};
