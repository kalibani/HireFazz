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
  Airplay,
  ArrowUpDown,
  ChevronDown,
  FileSearchIcon,
  ShieldPlus,
  Trash2,
  Zap,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination, { PaginationGroup } from '@/components/ui/pagination';
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
import { formatDateDMY } from '@/helpers';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { TCV, TDetailJobTableProps } from '@/lib/actions/job/getJob';
import axios from 'axios';
import { Loader } from '@/components/share';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { match } from 'ts-pattern';
import StatusAction from './status-action';
import { useTranslations } from 'next-intl';

const DetailJobAllApplicant: React.FC<TDetailJobTableProps> = ({
  jobDetail,
}) => {
  const searchParams = useSearchParams();
  const t = useTranslations('JobDetail')
  const perPage = Number(searchParams.get('per_page') || '10');
  const activePage = Number(searchParams.get('page') || '1');
  const pathname = usePathname();
  const params = useParams();
  const { replace, refresh, push } = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isLoading, setIsLoading] = useState(false);
  const cvAnalysis = jobDetail?.data?.cvAnalysis;
  const pagination = jobDetail?.cvAnalysisPagination;

  const columns: ColumnDef<TCV>[] = [
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columnName')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="mb-1 w-auto truncate capitalize">
          {row.original.cv.name?.slice?.(0, 20)}
          {row.original.cv.name?.length > 20 && (
            <HoverCard>
              <HoverCardTrigger>...</HoverCardTrigger>
              <HoverCardContent className="w-full">
                {row.original.cv.name}
              </HoverCardContent>
            </HoverCard>
          )}
        </p>
      ),
    },
    {
      accessorKey: 'addedOn',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columnCreatedAt')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">
          {formatDateDMY(row.original.cv.createdAt.toString())}
        </p>
      ),
    },
    {
      id: 'upload',
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columnUpload')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p
            className={match(row.original.cv.uploadStatus)
              .with('SUCCESS', () => 'text-green-500')
              .with('PENDING', () => 'text-yellow-500')
              .with('FAILED', () => 'text-red-500')
              .with('PROCESSING', () => 'text-blue-500')
              .otherwise(() => 'text-red-500')}
          >
            {match(row.original.cv.uploadStatus)
              .with('SUCCESS', () => 'Uploaded')
              .with('PENDING', () => 'Pending')
              .with('FAILED', () => 'Failed.')
              .with('PROCESSING', () => 'Uploading...')
              .otherwise(() => 'Not Uploaded.')}
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
            {t('columnStatus')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p
            className={match(row.original.status)
              .with('ANALYSYS', () => 'text-green-500')
              .with('ON_ANALYSYS', () => 'text-blue-500')
              .with('PENDING', () => 'text-yellow-500')
              .with('SHORTLISTED', () => 'text-blue-500')
              .with('REJECTED', () => 'text-red-500')
              .with('INTERVIEW', () => 'text-green-500')
              .otherwise(() => 'text-red-500')}
          >
            {match(row.original.status)
              .with('ANALYSYS', () => t('analyzed'))
              .with('ON_ANALYSYS', () => t('analyzing'))
              .with('PENDING', () => 'Pending')
              .with('SHORTLISTED', () => 'Shortlisted')
              .with('REJECTED', () => 'Rejected')
              .with('INTERVIEW', () => 'Interview')
              .otherwise(() => t('failed'))}{' '}
          </p>
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
              <Trash2 width={18} className="text-rose-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('page', '1');
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

  const analyzeButton = (() => {
    const selectedIds = getSelectedRowIds();

    const onClickAnalyze = () => {
      setIsLoading(true);
      axios
        .post('/api/cv-analysis/analyze', { selectedIds })
        .finally(handleFinally);
      push(`/${params?.orgId}/job/${params?.id}/screened`);
    };

    return (
      <Button
        className="flex gap-2 py-1 text-sm"
        disabled={!selectedIds.length}
        onClick={onClickAnalyze}
      >
        <Airplay className="size-6" />
        {t('cta_analyze')}{' '}
        {selectedIds.length ? t('selectedCV', { amount: selectedIds.length }) : ''}
      </Button>
    );
  })();

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <FileSearchIcon className="size-4 text-red-500" />
            <p>
              {t.rich('tableAmount', { amount: cvAnalysis?.length || 0, job: jobDetail?.data?.jobName, b: (chunks) => <b>{chunks}</b> })}
            </p>
          </div>

          {/* <span className="pl-6 mt-4">
                        Status: <span className="text-blue-700">3/5 Uploading...</span>
                    </span> */}
        </div>

        <div className="flex flex-col items-end">
          {analyzeButton}

          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="size-4 text-rose-500" />
              <span>
                {t.rich('remainingQuota', { b: (chunks) => <b>{chunks}</b>, quota: 6 })}
              </span>
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-1 px-0 font-bold text-rose-500 hover:bg-transparent hover:text-rose-500"
            >
              <ShieldPlus className="size-4" />
              {t('topup')}
            </Button>
          </div>
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
          <StatusAction getSelectedRowIds={getSelectedRowIds} onApiEnd={handleFinally} setIsLoading={setIsLoading} />
        </div>

        {/* <div className="w-full bg-rose-100 flex justify-center items-center py-3 text-xs">
                    <span className="text-slate-400">3 CV Selected, or </span>
                    &nbsp;
                    <span className="text-rose-600 font-medium">select all cv on this page</span>
                </div> */}
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
        
        <PaginationGroup
          activePage={activePage}
          perPage={perPage}
          handlePagination={handlePagination}
          totalItems={pagination?.totalItems || 0}
        />

      {isLoading && (
        <div className="fixed left-0 top-0 z-50 h-full w-full items-start justify-center rounded-lg bg-black bg-opacity-40">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default DetailJobAllApplicant;
