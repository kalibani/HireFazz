'use client';

import React from 'react';

import {
  FileArchiveIcon,
  MoreHorizontal,
  Plus,
  Check,
  X,
  Loader2,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import * as formatter from 'date-fns';
import Link from 'next/link';
import Heading from '@/components/headings';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/upload-button';

import EmptyPage from '@/components/empty';
import LoaderGeneral from '@/components/loader';
import { useProModal } from '@/hooks/use-pro-modal';
import { trpc } from '@/src/app/[locale]/_trpc/client';
import { useUser } from '@/hooks/use-user';
import { useAnalyzer } from '@/hooks/use-analyzer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ReanalyzeModal } from '@/components/reanalyze-modal';
import { usePricing } from '@/hooks/use-pricing';
import { pricing } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const limit = 10;
interface AnalyzeCV {
  id: string;
  jobTitle?: string;
  requirement?: string;
  percentage?: number;
}
const CvScanner = () => {
  const t = useTranslations('dashboard');

  const { apiLimitCount, onOpen } = useProModal();

  const { subscriptionType, maxFreeCount, setPlan, setQuota, setQuotaLimited } =
    useUser();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [reanalyzeIds, setReanalyzeIds] = useState<string[]>([]);
  const {
    data: filesInfinite,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = trpc.infiniteFiles
    // @ts-ignore
    .useInfiniteQuery(
      { limit },
      {
        networkMode: 'always',
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const filesMemo = useMemo(() => {
    if (filesInfinite?.pages) {
      // @ts-ignore
      return filesInfinite?.pages.reduce((acc, el) => {
        return [...acc, ...el.items];
      }, []);
    }
    return [];
  }, [filesInfinite?.pages]);

  const utils = trpc.useUtils();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    retry: 3,
    networkMode: 'always',
    onSuccess: () => {
      utils.infiniteFiles.refetch();
    },
    async onMutate({ id }) {
      setDeletingIds([...deletingIds, id]);
    },
    onSettled(data) {
      setDeletingIds(deletingIds.filter((el) => el !== data?.id));
    },
  });

  const isQuotaLimited =
    subscriptionType !== 'FREE' && apiLimitCount === maxFreeCount;
  const isFreeTrialLimited = apiLimitCount === maxFreeCount;

  const { jobTitle, requirements, percentage } = useAnalyzer();

  const analyzeCV = async ({
    id,
    jobTitle: jobTitleProp,
    requirement,
    percentage: percentageProp,
  }: AnalyzeCV) => {
    const safeRequirement = requirement || requirements;
    const safePercentage = percentageProp || percentage;
    const safeJobTitle = jobTitleProp || jobTitle;

    try {
      await axios.post('/api/cv-analyzer', {
        jobTitle: safeJobTitle,
        fileId: id,
        requirements: safeRequirement,
        percentage: safePercentage,
      });
      utils.infiniteFiles.refetch();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    // @ts-ignore
    if (filesMemo?.length) {
      filesMemo
        // @ts-ignore
        .reduce((acc, item) => {
          return acc.then(() => {
            if (item.reportOfAnalysis) {
              return;
            }
            return analyzeCV({ id: item.id });
          });
        }, Promise.resolve())
        // @ts-ignore
        .then((res) => {})
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [filesMemo]);

  const isMoreThanMatchLimit = (
    userPercentage: string,
    matchedPercentage: string
  ) => {
    return Number(matchedPercentage) >= Number(userPercentage);
  };

  const handleDelete = async (id: string) => {
    deleteFile({ id });
  };

  const handleReanalyze = async (
    jobTitle: string,
    requirement: string,
    percentage: number
  ) => {
    // @ts-ignore
    const fileId = selectedFile.id;
    setSelectedFile({});
    try {
      setReanalyzeIds([...reanalyzeIds, fileId]);
      await analyzeCV({ id: fileId, jobTitle, requirement, percentage });
    } catch (error) {
    } finally {
      setReanalyzeIds(reanalyzeIds.filter((id) => id !== fileId));
    }
  };

  const { setPrice } = usePricing();

  const handleUpgrade = () => {
    const subsType = subscriptionType.toUpperCase();
    // @ts-ignore
    const price = pricing[subsType];
    setPrice(price);
    setPlan(subscriptionType);
    setQuota(maxFreeCount);
    onOpen();
  };

  useEffect(() => {
    setQuotaLimited(isQuotaLimited);
  }, [isQuotaLimited]);

  return (
    <>
      <div className="p-4 lg:p-8">
        <div>
          <div className="flex items-center justify-between w-full h-16 gap-2 p-4 px-3 border rounded-lg md:px-4 focus-within:shadow-sm">
            <h1 className="mb-3text-gray-900">
              {t('page.cv-scan.placeholder')}
            </h1>
            {isQuotaLimited || isFreeTrialLimited ? (
              <Button onClick={handleUpgrade}>
                {t('page.cv-scan.button.upload-cv')}
              </Button>
            ) : (
              <UploadButton
                buttonText={t('page.cv-scan.button.upload-cv')}
                refetch={() => utils.infiniteFiles.refetch()}
              />
            )}
          </div>
        </div>

        {/* @ts-ignore */}
        {filesMemo && filesMemo?.length > 0 ? (
          <div className="flex justify-end mt-4 mb-2 mr-1 gap-1">
            {t.rich('page.cv-scan.matched', {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </div>
        ) : null}

        <div className="">
          {/* @ts-ignore */}
          {filesMemo && filesMemo?.length !== 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-6 divide-y divide-zinc-200  xl:grid-cols-3 md:grid-cols-2">
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
                              <Button
                                variant="ghost"
                                className="mr-4"
                                size="icon"
                              >
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[100px]">
                              <DropdownMenuItem>
                                <Button
                                  className="w-full "
                                  size="sm"
                                  onClick={() => setSelectedFile(file)}
                                >
                                  {t('page.cv-scan.button.reanalyze')}
                                </Button>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Button
                                  className="w-full text-red-500 border-red-500 hover:text-red-500"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(file.id)}
                                >
                                  {t('page.cv-scan.button.delete')}
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
                                      {file.reportOfAnalysis?.documentOwner ||
                                        file?.name}
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
                              {file.reportOfAnalysis?.matchedPercentage ? (
                                <div className="flex lg:items-center lg:justify-center h-10 gap-1 text-base text-zinc-900">
                                  {/* @ts-ignore */}
                                  {file.reportOfAnalysis?.matchedPercentage}%
                                  <p>Match</p>
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
                                    {t('page.cv-scan.button.reanalyze')}
                                    <Tooltip delayDuration={200}>
                                      <TooltipTrigger className="cursor-default ml-1.5">
                                        <AlertCircle className="w-4 h-4 text-zinc-500" />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="p-2 w-80"
                                        align="end"
                                      >
                                        {t(
                                          'page.cv-scan.modal.tooltip.content-3'
                                        )}
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
            </>
          ) : isLoading ? (
            <div className="flex items-start mt-8 justify-center w-full p-8 rounded-lg bg-muted">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label={t('page.cv-scan.empty-page')} />
          )}

          {hasNextPage && !isLoading && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="text-blue-400"
                onClick={() => fetchNextPage()}
                disabled={isLoading}
              >
                {t('page.cv-scan.button.load-more')}
              </Button>
            </div>
          )}

          {/* @ts-ignore */}
          {isLoading && !!filesMemo.length && (
            <div className="flex justify-center mt-4">
              <Loader2 className="mr-4 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <ReanalyzeModal
        // @ts-ignore
        open={!!selectedFile?.id}
        // @ts-ignore
        selectedFile={selectedFile}
        onOpenChange={() => setSelectedFile({})}
        onSubmit={handleReanalyze}
      />
    </>
  );
};

export default CvScanner;
