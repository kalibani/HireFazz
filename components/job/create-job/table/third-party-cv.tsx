import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateDMY, formatFileSize } from "@/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";


export interface ThirdPartyCVData {
    name: string
    jobName: string
    appliedAt: number
    location: string
}

export const columns: ColumnDef<ThirdPartyCVData>[] = [
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
                    Name
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="capitalize">{row.getValue('name')}</p>
        ),
    },
    {
        accessorKey: 'jobName',
        header: ({ column }) => {
            return (
                <Button
                    className="w-fit px-4 pl-0 hover:bg-transparent"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Job
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="capitalize text-slate-400">{row.getValue('jobName')}</p>
        ),
    },
    {
        accessorKey: 'appliedAt',
        header: ({ column }) => {
            return (
                <Button
                    className="w-fit px-4 pl-0 hover:bg-transparent"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Applied At
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="capitalize text-slate-400">{formatDateDMY(row.getValue('appliedAt'))}</p>
        ),
    },
    {
        accessorKey: 'location',
        header: ({ column }) => {
            return (
                <Button
                    className="w-fit px-4 pl-0 hover:bg-transparent"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Location
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <p className="capitalize text-slate-400">{row.getValue('location')}</p>
        ),
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