import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateDMY, formatFileSize } from '@/helpers';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Trash2 } from 'lucide-react';

// todo: adjust props
export interface UploadCVData {
  file: File;
}

export const columns: ColumnDef<UploadCVData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-slate-400 bg-white text-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          className="w-fit px-4 pl-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          File Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="capitalize">{row.original.file.name}</p>,
  },
  {
    accessorKey: 'Added on',
    header: ({ column }) => {
      return (
        <Button
          className="w-fit px-4 pl-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Added On
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="capitalize text-slate-400">
        {formatDateDMY(row.original.file.lastModified)}
      </p>
    ),
  },
  {
    accessorKey: 'size',
    header: ({ column }) => {
      return (
        <Button
          className="w-fit px-4 pl-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Size
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size: number = row.original.file.size;
      return (
        <p className="capitalize text-slate-400">{formatFileSize(size)}</p>
      );
    },
  },
  {
    accessorKey: 'from',
    header: ({ column }) => {
      return (
        <Button
          className="w-fit px-4 pl-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          From
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="capitalize text-slate-400">{row.getValue('from')}</p>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="hover:bg-transparent">
          <Trash2 className="size-4 text-primary" />
        </Button>
      );
    },
  },
];

