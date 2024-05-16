'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  ChevronDown,
  FileSearchIcon,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/ui/pagination';
import { PER_PAGE_ITEMS } from '@/constant';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { GetJobDetailResponse, TCV } from '@/lib/actions/job/getJob';
import axios from 'axios';
import { ANALYSYS_STATUS } from '@prisma/client';
import { Loader } from '@/components/share';

interface DetailJobTableProps {
  jobDetail?: GetJobDetailResponse;
}

const DetailJobShortListed: React.FC<DetailJobTableProps> = ({ jobDetail }) => {
  const searchParams = useSearchParams();
  const perPage = Number(searchParams.get('per_page') || '10');
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { replace, refresh } = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedAction, setSelectedAction] = useState('SHORTLISTED');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isLoading, setIsLoading] = useState(false);

  const cvAnalysis = jobDetail?.data?.cvAnalysis.filter(
    (x) => x.status === ANALYSYS_STATUS.SHORTLISTED,
  );

  const columns: ColumnDef<TCV>[] = [
    {
      accessorKey: 'check',
      header: () => <p></p>,
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="w-2/3 truncate capitalize">{row.original.cv.name}</p>
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">{row.original.location}</p>
        );
      },
    },
    {
      id: 'scoreMatch',
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Score Match
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">
            {row.original.reportOfAnalysis?.matchedPercentage}%
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
            className="w-fit px-4 pl-0 text-center hover:bg-transparent"
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
          <p className="capitalize text-slate-400">{row.original.status}</p>
        );
      },
    },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ row, table }) => {
        const onDelete = () => {
          if (!confirm(`Delete ${row.original.cv.name}`)) {
            return;
          }
          setIsLoading(true);
          axios
            .delete(`/api/cv-analysis/${row.original.id}`)
            .finally(handleFinally);
        };
        return (
          <div className="flex items-center gap-2">
            <Button
              disabled={!!table.getSelectedRowModel().rows.length}
              variant="ghost"
              onClick={onDelete}
            >
              <Trash2 className="text-rose-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const table = useReactTable({
    data: cvAnalysis || [],
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

  const handleFinally = () => {
    setIsLoading(false);
    refresh();
  };

  const getSelectedRowIds = () => {
    const selectedRow = table.getSelectedRowModel().flatRows;

    return selectedRow.map((row) => row.original.id);
  };

  const handleAction = () => {
    if (!confirm(`${selectedAction} all selected items?`)) {
      return;
    }

    setIsLoading(true);
    if (selectedAction === 'DELETE') {
      axios
        .delete('/api/cv-analysis', {
          data: {
            selectedIds: getSelectedRowIds(),
          },
        })
        .finally(handleFinally);
    } else if (selectedAction === 'Send Email') {
      router.push(`/${params?.orgId}/job/${params?.id}/send-email`);
    } else {
      axios
        .patch(`/api/cv-analysis`, {
          actionName: selectedAction,
          selectedIds: getSelectedRowIds(),
        })
        .finally(handleFinally);
    }
  };

  const interviewButton = (() => {
    const selectedIds = getSelectedRowIds();

    const onClickInterview = () => {
      setIsLoading(true);
      axios
        .post('/api/cv-analysis', {
          selectedIds,
          actionName: ANALYSYS_STATUS.INTERVIEW,
        })
        .finally(handleFinally);
    };

    return (
      <Button
        className="flex gap-2 py-1 text-sm"
        disabled={!selectedIds.length}
        onClick={onClickInterview}
      >
        <MessageSquare className="size-6" />
        Automatic Interview
      </Button>
    );
  })();

  // todo: handle action list for delete & send email
  const actionList = [
    ANALYSYS_STATUS.SHORTLISTED,
    ANALYSYS_STATUS.REJECTED,
    ANALYSYS_STATUS.INTERVIEW,
    'DELETE',
    'Send Email',
  ];
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <FileSearchIcon className="size-4 text-red-500" />
            <p>
              There {(cvAnalysis?.length || 0) > 1 ? 'are' : 'is'}{' '}
              <b>{cvAnalysis?.length} applicants</b> on{' '}
              <b>“{jobDetail?.data?.jobName}”</b>
            </p>
          </div>

          {/* <span className="pl-6 mt-4">
                        Status: <span className="text-blue-700">3/5 Uploading...</span>
                    </span> */}
        </div>

        <div className="flex-co flex items-end justify-center">
          {interviewButton}
        </div>
      </div>

      <div className="mt-4 w-full rounded-t-md border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="mr-3 flex items-center gap-1">
            <Checkbox
              aria-label="Select all"
              className="border-slate-400 bg-white text-black"
              disabled={!cvAnalysis?.length}
              checked={table.getIsAllRowsSelected()}
              onClick={table.getToggleAllRowsSelectedHandler()}
            />
            <ChevronDown className="size-4" />
          </div>
          <Select onValueChange={(v) => setSelectedAction(v)}>
            <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
              <SelectValue
                placeholder="Shortlisted"
                defaultValue="SHORTLISTED"
              />
            </SelectTrigger>

            <SelectContent>
              {actionList.map((action) => (
                <SelectItem key={action} value={action} className="capitalize">
                  {action.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-[30px] px-2 text-xs" onClick={handleAction}>
            Action
          </Button>
        </div>
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
            itemsPerPage={perPage}
            totalItems={cvAnalysis?.length || 0}
            onPageChange={(page) => handlePagination('page', page.toString())}
          />
        </div>
        <div></div>
      </div>

      {isLoading && (
        <div className="fixed left-0 top-0 z-50 h-full w-full items-start justify-center rounded-lg bg-black bg-opacity-40">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default DetailJobShortListed;
