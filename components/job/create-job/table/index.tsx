'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FileSearchIcon } from 'lucide-react';


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InputFilter from '@/components/table/input-filter';
import { useFormStepStore } from '@/zustand/useCreateJob';
import { PaginationGroup } from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface TableCVProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  dataFrom?: string;
  totalItems?: number
}

const TableCV = <T,>(props: TableCVProps<T>) => {
  const searchParams = useSearchParams();
  const perPage = searchParams.get('per_page');
  const currPage = searchParams.get('page');
  const query = searchParams.get('search');
  const pathname = usePathname();
  const { replace } = useRouter();
  const { data, columns, dataFrom = 'Candidates' } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { dataCreateJob } = useFormStepStore((state) => state);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const jobTitle = dataCreateJob?.title || '-';

  const handleSearch = (type: 'per_page' | 'page' | 'search', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-3 h-full">
      <div className="mx-5 flex items-center gap-2">
        <FileSearchIcon className="text-red-500" />
        {!!data.length && jobTitle ? (
          <p>
            There is <b>{data.length} CVs</b> has been added with job tittle{' '}
            <b>
              “{jobTitle}” from {dataFrom}
            </b>{' '}
          </p>
        ) : (
          <p>There is no CV has been added.</p>
        )}
      </div>

      <div className="mx-2 flex gap-28">
        {/* <InputFilter label="Search" placeholder="Location" /> */}
        <InputFilter label="Search" placeholder="Search by Name" value={query || ''} onChange={(value) => handleSearch('search', value)} />
      </div>

      <div className="border-b flex-1">
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
      </div>

      <div className="px-4 py-4">
        <PaginationGroup
          perPage={Number(perPage || '10')}
          totalItems={props.totalItems || data.length}
          activePage={currPage ? Number(currPage) : undefined}
          handlePagination={handleSearch}
        />
      </div>
    </div>
  );
};

export default TableCV;
