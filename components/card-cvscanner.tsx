'use client';

import {
  Loader2,
  MoreVertical,
  Plus,
  MoreHorizontal,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import * as formatter from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface CardProps {
  filesMemo: any;
  deletingIds: string[];
  jobTitle: string;
  onClickSelectFile: (id: string) => void;
  reanalyzeIds: any;
  isMoreThanMatchLimit: any;
  onDelete: (file: any) => void;
}

const CardCvscanner = ({
  filesMemo,
  deletingIds,
  jobTitle,
  onClickSelectFile,
  reanalyzeIds,
  isMoreThanMatchLimit,
  onDelete,
}: CardProps) => {
  return (
    <ul className="grid grid-cols-1 gap-6 divide-y divide-zinc-200  xl:grid-cols-3 lg:grid-cols-2">
      {/* @ts-ignore */}
      {filesMemo
        // @ts-ignore
        .sort(
          (
            a: { reportOfAnalysis: { matchedPercentage: any } },
            b: { reportOfAnalysis: { matchedPercentage: any } }
          ) =>
            Number(b.reportOfAnalysis?.matchedPercentage) -
            Number(a.reportOfAnalysis?.matchedPercentage)
        )
        .map((file: any) => (
          <li
            key={file.id}
            className="col-span-1 transition bg-white divide-y divide-gray-200 rounded-lg shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <Link
                href={`/cv-scanner/${file.id}`}
                className="flex flex-col flex-1 gap-2"
              >
                <div className="flex items-center justify-between max-w-[300px] p-4 space-x-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <p className="text-lg font-medium line-clamp-1 text-zinc-900">
                    {file.name}
                  </p>
                </div>
              </Link>
              {deletingIds.includes(file.id) ? (
                <Loader2 className="mr-4 text-blue-500 animate-spin" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="mr-4" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit" align="end">
                    {!file.reportOfAnalysis && (
                      <DropdownMenuItem>
                        <Button
                          className="w-full "
                          size="sm"
                          onClick={() => onClickSelectFile(file)}
                        >
                          Reanalyze
                        </Button>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Button
                        className="w-full text-red-500 border-red-500 hover:text-red-500"
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(file.id)}
                      >
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div>
              <div className="flex lg:justify-between lg:flex-row flex-col-reverse px-4 pt-2 text-base text-zinc-900">
                <div className="flex items-center gap-2">
                  {
                    <>
                      {/* @ts-ignore */}
                      {file.reportOfAnalysis ? (
                        <>
                          <p className="w-48 line-clamp-1">
                            {/* @ts-ignore */}
                            {file.reportOfAnalysis?.documentOwner || file?.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>
                            {/* @ts-ignore */}
                            {formatter.format(
                              new Date(file.createdAt),
                              'MMM yyyy'
                            )}
                          </span>
                        </>
                      )}
                    </>
                  }
                </div>

                {(jobTitle && !file.reportOfAnalysis) ||
                reanalyzeIds.includes(file.id) ? (
                  <div className="flex p-2 text-base text-zinc-900 items-center">
                    Analyzing
                    <MoreHorizontal className="ml-1 h-4 w-4 shrink-0 opacity-50 animate-ping text-zinc-900" />
                  </div>
                ) : (
                  <>
                    {file.reportOfAnalysis ? (
                      <div className="flex lg:items-center lg:justify-center h-10 gap-1 text-base text-zinc-900">
                        {/* @ts-ignore */}
                        {file.reportOfAnalysis?.matchedPercentage}%<p>Match</p>
                        {isMoreThanMatchLimit(
                          // @ts-ignore
                          file.reportOfAnalysis?.percentage,
                          // @ts-ignore
                          file.reportOfAnalysis?.matchedPercentage
                        ) ? (
                          <Check className="w-5 h-5 text-green-500 " />
                        ) : (
                          <X className="w-5 h-5 text-red-500 " />
                        )}
                      </div>
                    ) : (
                      <TooltipProvider>
                        <label className="mr-2 text-lg font-semibold">
                          Please Reanalyze
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger className="cursor-default ml-1.5">
                              <AlertCircle className="w-4 h-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="p-2 w-80" align="end">
                              Process stopped because you refresh the page,
                              please reanalyze and do not refresh the page
                            </TooltipContent>
                          </Tooltip>
                        </label>
                      </TooltipProvider>
                    )}
                  </>
                )}
              </div>
              <div className="px-4 pb-1 text-zinc-900 text-sm">
                {file.reportOfAnalysis?.jobTitle}
              </div>
              <div className="px-4 pb-4">
                {!reanalyzeIds.includes(file.id) && (
                  <p className="text-xs text-zinc-500">
                    {/* @ts-ignore */}
                    {file.reportOfAnalysis?.reason}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default CardCvscanner;
