"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex?: number;
  pageSize?: number;
  tableClassName?: string;
  tableHeaderClassName?: string;
  tableHeadClassName?: string;
  disableNextPage?: boolean;
  disablePreviousPage?: boolean;
  isLoading?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  tableClassName,
  tableHeaderClassName,
  tableHeadClassName,
  disableNextPage,
  disablePreviousPage,
  isLoading,
  onNextPage,
  onPreviousPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: pageIndex !== undefined ? pageIndex : 1,
        pageSize: pageSize || 7,
      },
    },
  });

  return (
    <div className="w-full">
      <Table className={cn(tableClassName)}>
        <TableHeader className={cn("bg-black", tableHeaderClassName)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn("text-white", tableHeadClassName)}
                    style={{
                      minWidth: 110,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Loader2 className="h-10 w-10 animate-spin block m-auto" />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
            </>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-3">
        <div className="flex-1 text-sm text-muted-foreground">
          showing {table.getPaginationRowModel().rows.length} of{" "}
          {pageSize !== undefined
            ? pageSize
            : table.getFilteredRowModel().rows.length}{" "}
          row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPreviousPage ? onPreviousPage() : table.previousPage()
            }
            disabled={
              disablePreviousPage !== undefined
                ? disablePreviousPage
                : !table.getCanPreviousPage()
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (onNextPage ? onNextPage() : table.nextPage())}
            disabled={
              disableNextPage !== undefined
                ? disableNextPage
                : !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
