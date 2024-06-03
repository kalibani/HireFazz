'use client';

import { ArrowUpDown, Trash2 } from 'lucide-react';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Button } from '../ui/button';
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
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../ui/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PaginationGroup } from '../ui/pagination';
import { Loader } from '../share';

type TColumn = {
  id: string;
  name: string;
  email: string;
};

const TableInvite = ({
  dataSource,
  setImportedCandidates,
}: {
  dataSource: any;
  setImportedCandidates: Dispatch<SetStateAction<TColumn[]>>;
}) => {
  const { replace } = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const perPage = searchParams.get('per_page') || '10';
  const currPage = searchParams.get('page') || '1';
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableItems, setTableItems] = useState<TColumn[]>([]);
  const [isPending, startTransition] = useTransition();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (dataSource.length) {
      const firstItem = (Number(currPage) - 1) * Number(perPage);
      const lastItem = Number(currPage) * Number(perPage);
      const itemInPage = dataSource.slice(firstItem, lastItem);
      setTableItems(itemInPage);
    }
  }, [perPage, currPage, dataSource]);

  const columns: ColumnDef<TColumn>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-full capitalize text-slate-400">{row.original.name}</p>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-full text-slate-400">{row.original.email}</p>
      ),
    },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ table, row }) => {
        const onDelete = () => {
          startTransition(async () => {
            const newData = await tableItems.filter(
              (item) => item.id !== row.original.id,
            );
            setTableItems(newData);
            setImportedCandidates(newData);
          });
        };
        return (
          <Button
            disabled={!!table.getSelectedRowModel().rows.length}
            variant="ghost"
            onClick={onDelete}
            className="w-fit"
          >
            <Trash2 width={18} className="text-primary" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableItems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <>
      <div className="my-4">
        <Table className="border">
          <TableHeader className="bg-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'text-sm font-normal text-black',
                        header.column.id === 'action' && 'text-right',
                      )}
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'py-0',
                          cell.column.id === 'action' && 'text-right',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
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
      {tableItems.length > 0 && (
        <PaginationGroup
          perPage={Number(perPage || '10')}
          totalItems={dataSource.length || []}
          activePage={currPage ? Number(currPage) : undefined}
          handlePagination={handlePagination}
        />
      )}

      {isPending && <Loader />}
    </>
  );
};

export default TableInvite;
