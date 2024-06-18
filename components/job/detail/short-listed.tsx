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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import { TCV, TDetailJobTableProps } from '@/lib/actions/job/getJob';
import axios from 'axios';
import { ANALYSYS_STATUS } from '@prisma/client';
import { Loader } from '@/components/share';
import { P, match } from 'ts-pattern';
import StatusAction from './status-action';
import { TFunction } from '@/i18n';
import { useTranslations } from 'next-intl';

const DetailJobShortListed: React.FC<TDetailJobTableProps> = ({
  jobDetail,
}) => {
  const searchParams = useSearchParams();
  const t = useTranslations('JobDetail')
  const perPage = Number(searchParams.get('per_page') || '10');
  const currPage = Number(searchParams.get('page'));
  const pathname = usePathname();
  const { replace, refresh } = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isLoading, setIsLoading] = useState(false);

  const cvAnalysis = jobDetail?.data?.cvAnalysis.filter(
    (x) => x.status === ANALYSYS_STATUS.SHORTLISTED,
  );

  const columns:ColumnDef<TCV>[] = [
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
              {t('columnName')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <p className="w-2/3 truncate capitalize">{row.original.cv.name}</p>
        ),
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
              {t('scoreMatch')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const percentage = row.original.reportOfAnalysis?.matchedPercentage
          return (
            <p className="capitalize text-slate-400">
              {percentage ?  percentage + '%' : '-'}
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
              className={match(row.original.reportOfAnalysis?.matchedPercentage)
                .with(P.number.gt(80), () => 'text-green-500')
                .with(P.number.gt(60), () => 'text-blue-500')
                .with(P.number.lt(60), () => 'text-red-500')
                .otherwise(() => 'text-red-500')}
            >
              {match(row.original.reportOfAnalysis?.matchedPercentage)
                .with(P.number.gt(80), () => t('goodCandidate'))
                .with(P.number.gt(60), () => t('averageCandidate'))
                .with(P.number.lt(60), () => t('badCandidate'))
                .otherwise(() => t('badCandidate'))}
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
    ]

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
    data: jobDetail?.data?.cvAnalysis || [],
    columns: columns,
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
  return (
    <div className="mt-4">
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


      <PaginationGroup
        perPage={perPage}
        totalItems={jobDetail?.cvAnalysisPagination.totalItems || 0}
        handlePagination={handlePagination}
        activePage={Number.isNaN(currPage) ? undefined : currPage}
      />
      

      {isLoading && (
        <div className="fixed left-0 top-0 z-50 h-full w-full items-start justify-center rounded-lg bg-black bg-opacity-40">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default DetailJobShortListed;
