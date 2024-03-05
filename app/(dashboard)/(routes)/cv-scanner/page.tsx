'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import Heading from '@/components/headings';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/upload-button';

import EmptyPage from '@/components/empty';
import LoaderGeneral from '@/components/loader';
import { useProModal } from '@/hooks/use-pro-modal';
import { trpc } from '@/app/_trpc/client';
import { useUser } from '@/hooks/use-user';
import { useAnalyzer } from '@/hooks/use-analyzer';

import { ReanalyzeModal } from '@/components/reanalyze-modal';
import { usePricing } from '@/hooks/use-pricing';
import { pricing } from '@/lib/utils';
import CardCvscanner from '@/components/card-cvscanner';
import SearchInput from '@/components/search-input';
import { SearchParamsProps } from '@/types/types';
import { useCvScanner } from '@/hooks/use-cvScanner';

const CVAnalyzerPage = ({ searchParams }: SearchParamsProps) => {
  const { apiLimitCount, onOpen } = useProModal();
  const { subscriptionType, maxFreeCount, setPlan, setQuota, setQuotaLimited } =
    useUser();
  const utils = trpc.useUtils();
  const {
    filesMemo,
    isLoading,
    deleteFile,
    deletingIds,
    selectedFile,
    fetchNextPage,
    handleReanalyze,
    hasNextPage,
    jobTitle,
    reanalyzeIds,
    setSelectedFile,
  } = useCvScanner(searchParams);

  const isQuotaLimited =
    subscriptionType !== 'FREE' && apiLimitCount === maxFreeCount;
  const isFreeTrialLimited = apiLimitCount === maxFreeCount;

  const isMoreThanMatchLimit = (
    userPercentage: string,
    matchedPercentage: string
  ) => {
    return Number(matchedPercentage) >= Number(userPercentage);
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
    <div>
      <Heading
        title="CV Screener"
        description="Screening Hundreds of CVs in mere Minutes"
        icon={FileText}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <div className="p-4 lg:p-8">
        <div>
          <div className="flex items-center justify-between w-full h-16 gap-2 p-4 px-3 border rounded-lg md:px-4 focus-within:shadow-sm">
            <h1 className="mb-3text-gray-900">Start Screening</h1>
            {isQuotaLimited || isFreeTrialLimited ? (
              <Button onClick={handleUpgrade}>Upload CV</Button>
            ) : (
              <UploadButton
                buttonText="Upload CV"
                refetch={() => utils.infiniteFiles.refetch()}
              />
            )}
          </div>
        </div>

        {filesMemo && (filesMemo?.length > 0 || !!searchParams?.q) && (
          <div className="flex lg:flex-row flex-col lg:justify-between items-center my-4 gap-y-4 mb-8">
            <SearchInput searchParams={searchParams} />
            <p>
              Automatically Sorted by <b>Highest Matched</b>
            </p>
          </div>
        )}

        <div className="">
          {/* @ts-ignore */}
          {filesMemo && filesMemo?.length !== 0 ? (
            <CardCvscanner
              reanalyzeIds={reanalyzeIds}
              deletingIds={deletingIds}
              filesMemo={filesMemo}
              isMoreThanMatchLimit={isMoreThanMatchLimit}
              jobTitle={jobTitle}
              onClickSelectFile={(val) => setSelectedFile(val)}
              onDelete={(id) => deleteFile({ id })}
            />
          ) : isLoading ? (
            <div className="flex items-start justify-center w-full p-8 rounded-lg bg-muted mt-8">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label="Pretty empty around here. Let's upload your first document." />
          )}
          {hasNextPage && !isLoading && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="text-blue-400"
                onClick={() => fetchNextPage()}
                disabled={isLoading}
              >
                Load More
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
    </div>
  );
};

export default CVAnalyzerPage;
