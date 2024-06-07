'use client';

import React, { FC, useState } from 'react';
import {
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
import { TResponseAllCandidates } from '@/lib/validators/interview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INVITED_USER_STATUS } from '@prisma/client';
import columnsTable from './columns';
import Pagination from '@/components/ui/pagination';
import { PER_PAGE_ITEMS } from '@/constant';

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
  const tab = params.tab;
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const perPage = Number(searchParams.get('per_page') || '10');
  const activePage = Number(searchParams.get('page') || '1');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedAction, setSelectedAction] = useState('SHORTLISTED');

  const actionList = [
    INVITED_USER_STATUS.SHORTLISTED,
    INVITED_USER_STATUS.REJECTED,
    'DELETE',
  ];

  const table = useReactTable({
    data: dataSource?.invitedUsers || [],
    columns: columnsTable(isEvaluate),
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

  const handlePagination = (query: 'per_page' | 'page', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('page', '1');
      params.set(query, value);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleAction = () => {
    if (isEvaluate) {
      console.log('action');
    } else {
      console.log('delete');
    }
  };

  const handleDetail = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    id: string,
  ) => {
    e.stopPropagation();
    console.log(id);
  };

  return (
    <>
      <div className="mt-4 flex w-full items-center justify-between rounded-t-md border px-4">
        <div className="flex items-center gap-2  py-2">
          <div className="mr-3 flex items-center gap-1">
            <Checkbox
              aria-label="Select all"
              className="border-slate-400 bg-white text-black"
              checked={table.getIsAllRowsSelected()}
              onClick={table.getToggleAllRowsSelectedHandler()}
            />
            {!isEvaluate && <p className="ml-3 text-xs">Select All</p>}
          </div>
          {isEvaluate && (
            <Select onValueChange={(select) => setSelectedAction(select)}>
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
            className="h-[30px] px-4 text-xs"
            disabled={!table.getSelectedRowModel().flatRows.length}
            onClick={() => handleAction()}
          >
            {!isEvaluate ? 'Delete' : 'Action'}
          </Button>
        </div>
        {tab === 'invited' && (
          <Button
            className="h-[30px] px-2 text-xs"
            onClick={() => console.log('ADD MORE CANDIDATE LINK ROUTE')}
          >
            Add More Candidates
          </Button>
        )}
      </div>
      {table.getSelectedRowModel().flatRows.length > 0 && (
        <div className="bg-rose-100 py-2 text-center text-xs transition-all delay-100 ease-in-out">
          <p className="text-slate-400">
            {table.getSelectedRowModel().flatRows.length} Candidates Selected,
            or{' '}
            <span
              className="cursor-pointer font-semibold text-slate-900 hover:text-blue-500"
              onClick={table.getToggleAllRowsSelectedHandler()}
            >
              select all candidates on this page
            </span>
          </p>
        </div>
      )}
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
                    className="py-2 hover:cursor-pointer"
                    onClick={(e) => handleDetail(e, row.original.id)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsTable().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {dataSource.invitedUsers.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <div className="flex max-w-44 items-center gap-2">
            <span>View</span>
            <Select
              onValueChange={(value) => handlePagination('per_page', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={perPage} defaultValue={perPage} />
              </SelectTrigger>

              <SelectContent>
                {PER_PAGE_ITEMS.map((pageItem) => (
                  <SelectItem key={pageItem} value={pageItem}>
                    {pageItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>List</span>
          </div>
          <div className="space-x-2">
            <Pagination
              activePage={activePage}
              itemsPerPage={perPage}
              totalItems={dataSource.invitedUsers.length || 0}
              onPageChange={(page) => handlePagination('page', page.toString())}
            />
          </div>

          <div></div>
        </div>
      )}
    </>
  );
};

export default TableDetail;
