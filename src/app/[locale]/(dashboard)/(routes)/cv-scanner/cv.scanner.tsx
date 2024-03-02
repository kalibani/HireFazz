'use client';

import React from 'react';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/upload-button';

import EmptyPage from '@/components/empty';
import LoaderGeneral from '@/components/loader';
import { useProModal } from '@/hooks/use-pro-modal';
import { trpc } from '@/src/app/[locale]/_trpc/client';
import { useUser } from '@/hooks/use-user';

import { ReanalyzeModal } from '@/components/reanalyze-modal';
import { usePricing } from '@/hooks/use-pricing';
import { pricing } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import SearchInput from '@/components/search-input';
import { useCvScanner } from '@/hooks/use-cvScanner';
import CardCvscanner from '@/components/card-cvScanner';
import type { SearchParamsProps } from '@/types/types';

const CvScanner = ({ searchParams }: SearchParamsProps) => {
  const t = useTranslations('dashboard');
  const { apiLimitCount, onOpen } = useProModal();

  const { subscriptionType, maxFreeCount, setPlan, setQuota, setQuotaLimited } =
    useUser();

  const {
    filesMemo,
    fetchNextPage,
    isLoading,
    hasNextPage,
    deletingIds,
    setSelectedFile,
    selectedFile,
    deleteFile,
    reanalyzeIds,
    jobTitle,
    handleReanalyze,
    autoSugession,
  } = useCvScanner(searchParams);

  const utils = trpc.useUtils();

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
          <>
            <SearchInput searchParams={searchParams} />
            <div className="flex justify-end mt-4 mb-2 mr-1 gap-1">
              {t.rich('page.cv-scan.matched', {
                b: (chunks) => <b>{chunks}</b>,
              })}
            </div>
          </>
        ) : null}

        <div className="">
          {/* @ts-ignore */}
          {filesMemo && filesMemo?.length !== 0 ? (
            <CardCvscanner
              filesMemo={filesMemo}
              deletingIds={deletingIds}
              jobTitle={jobTitle}
              reanalyzeIds={reanalyzeIds}
              isMoreThanMatchLimit={isMoreThanMatchLimit}
              onDelete={(val) => deleteFile({ id: val })}
              onClickSelectFile={(file) => setSelectedFile(file)}
            />
          ) : isLoading ? (
            <div className="flex items-start mt-8 justify-center w-full p-8 rounded-lg bg-muted">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label={t('page.cv-scan.empty-page')} />
          )}

          {/* @ts-ignore */}
          {hasNextPage && !isLoading && filesMemo.length >= 10 && (
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
