'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationGroup } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ANALYSYS_STATUS } from '@prisma/client';
import { ChevronDown, Search, FileSearchIcon } from 'lucide-react';
import React, { FC, ReactElement } from 'react';
import { ScreenedItem } from './detail-job-item';
import { TDetailJobTableProps } from '@/lib/actions/job/getJob';
import { P, match } from 'ts-pattern';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DetailJobRejected: FC<TDetailJobTableProps> = ({
  jobDetail,
}): ReactElement => {
  const actionList = [
    ANALYSYS_STATUS.SHORTLISTED,
    ANALYSYS_STATUS.REJECTED,
    ANALYSYS_STATUS.INTERVIEW,
    'DELETE',
    'Send Email',
  ];
  // Adjust filter in integration
  const filterBy = ['Name'];

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const cvAnalysis = jobDetail?.data?.cvAnalysis
  const pagination = jobDetail?.cvAnalysisPagination;
  const perPage = Number(searchParams.get('per_page') || '10');

  function handlePagination(query: 'per_page' | 'page', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(query, value);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const totalItems = cvAnalysis?.length ? cvAnalysis?.length : 0;
  const jobName = jobDetail?.data?.jobName;
  return (
    <div className="mt-5 flex h-auto flex-col gap-3">
      <div className="flex min-h-20 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileSearchIcon className="size-4 text-red-500" />
            <p className="text-sm">
              There {totalItems > 1 ? 'are' : 'is'}{' '}
              <b>{totalItems} applicants</b> on <b>“{jobName}”</b>
            </p>
          </div>
        </div>
      </div>
      {/* FILTERS */}
      <div className="flex justify-between gap-3 rounded-md border border-slate-200 px-2 py-3">
        <div className="mr-3 flex items-center gap-1">
          <Checkbox
            aria-label="Select all"
            className="border-slate-400 bg-white text-black"
          />
          <ChevronDown className="size-4" />

          <div className="ml-4 flex items-center gap-2">
            <Select>
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
            <Button className="h-[30px] px-2 text-xs">Action</Button>
          </div>
        </div>

        <div className="flex h-[28px] max-w-[200px] items-center gap-1 rounded-sm border border-slate-300 px-3">
          <input
            placeholder="Search Location"
            className="w-28 text-sm outline-none"
          />
          <Search className="size-4 shrink-0 text-slate-300" />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Sort by</label>
          <Select>
            <SelectTrigger className="h-[30px] w-fit text-xs capitalize">
              <SelectValue placeholder="Name" defaultValue="Name" />
            </SelectTrigger>

            <SelectContent>
              {filterBy.map((action) => (
                <SelectItem key={action} value={action} className="capitalize">
                  {action.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Filter by score</label>
          <Slider className="w-[170px]" min={0} max={100} defaultValue={[80]} />
        </div>
      </div>
      {cvAnalysis?.map((cv, index) => (
        <ScreenedItem
          key={index}
          isChecked={false}
          flag={match(cv?.reportOfAnalysis?.matchedPercentage)
            .with(P.number.gt(80), () => 'high')
            .with(P.number.gt(60), () => 'medium')
            .with(P.number.lt(60), () => 'low')
            .otherwise(() => '')}
          score={`${cv?.reportOfAnalysis?.matchedPercentage}%`}
          name={cv.reportOfAnalysis?.documentOwner}
          skills={`${cv?.reportOfAnalysis?.skills}`}
          location={cv?.reportOfAnalysis?.location}
          education={cv?.reportOfAnalysis?.education}
          experience={cv?.reportOfAnalysis?.experience}
          cvLink={cv?.cv?.url}
          description={cv?.reportOfAnalysis?.reason}
        />
      ))}

      {(cvAnalysis?.length as number) === 0 && (
        <p className="text-center">No data</p>
      )}

      {(cvAnalysis?.length as number) > 0 && (
        <PaginationGroup
          perPage={perPage}
          totalItems={pagination?.totalItems || 0}
          handlePagination={(page) => handlePagination('page', page.toString())}
        />
      )}
    </div>
  );
};

export default DetailJobRejected;
