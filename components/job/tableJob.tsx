'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, MoreVertical } from 'lucide-react'
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Pagination from '../ui/pagination';
import { PER_PAGE_ITEMS } from '@/constant';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { formatDateDMY } from '@/helpers';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GetJobListData } from '@/lib/actions/job/getJob';

interface TableJobProps {
  orgId: string
  jobData?: GetJobListData
}

export const TableJob: React.FC<TableJobProps> = ({ orgId, jobData }) => {
  const searchParams = useSearchParams()
  const perPage = searchParams.get('per_page')
  const currPage = searchParams.get('page')
  const pathname = usePathname();
  const { replace } = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  );

  const pageSize = Number(perPage || 10)

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
            Job Name
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
            Candidates
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">{row.getValue('candidates')}</p>
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
            Created at
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
            Shortlisted
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">{row.getValue('shortlisted')}</p>
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
            From
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">{row.getValue('companyName')}</p>
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
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent"
          >
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
          <Link href={`/${orgId}/job/${row.original.id}/all-applicant`} className="text-red-500 underline font-medium">
            View Job
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: jobData?.data.length,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex: 0
      }
    },
  });

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-4">
      <Table>
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
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-5">
        <div className="max-w-44 flex gap-2 items-center">
          <span>View</span>
          <Select onValueChange={(value) => handlePagination('per_page', value)}>
            <SelectTrigger>
              <SelectValue placeholder={pageSize} defaultValue={pageSize} />
            </SelectTrigger>

            <SelectContent>
              {PER_PAGE_ITEMS.map((pageItem) => <SelectItem key={pageItem} value={pageItem}>{pageItem}</SelectItem>)}
            </SelectContent>
          </Select>

          <span>List</span>
        </div>
        <div className="space-x-2">
          <Pagination activePage={Number(currPage)} itemsPerPage={pageSize} totalItems={jobData?.totalItems || 0} onPageChange={(page) => handlePagination('page', page.toString())} />
        </div>

        <div></div>
      </div>
    </div>
  );
};
