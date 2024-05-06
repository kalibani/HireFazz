'use client';

import { useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import Heading from '@/components/headings';

import { Button } from '@/components/ui/button';
import UploadButton from '@/components/upload-button';

import EmptyPage from '@/components/empty';
import LoaderGeneral from '@/components/share/loader';
import { useProModal } from '@/hooks/use-pro-modal';
import { useUser } from '@/hooks/use-user';

import { ReanalyzeModal } from '@/components/reanalyze-modal';
import { usePricing } from '@/hooks/use-pricing';
import { pricing } from '@/lib/utils';
import CardCvscanner from '@/components/card-cvscanner';
import SearchInput from '@/components/search-input';
import { SearchParamsProps } from '@/types/types';
import { useCvScanner } from '@/hooks/use-cvScanner';
import { auth } from '@/auth';
import { currentUser } from '@/lib/auth';
import { useCurrentUser } from '@/hooks/use-current-user';

const CVAnalyzerPage = ({ searchParams }: SearchParamsProps) => {
  const { apiLimitCount, onOpen } = useProModal();

  const { subscriptionType, maxFreeCount, setPlan, setQuota, setQuotaLimited } =
    useUser();
  const {
    filesMemo,
    refetch,
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
    matchedPercentage: string,
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
          <div className="flex h-16 w-full items-center justify-between gap-2 rounded-lg border p-4 px-3 focus-within:shadow-sm md:px-4">
            <h1 className="mb-3text-gray-900">Start Screening</h1>
            {isQuotaLimited || isFreeTrialLimited ? (
              <Button onClick={handleUpgrade}>Upload CV</Button>
            ) : (
              <UploadButton
                buttonText="Upload CV"
                refetch={() => console.log('refetch')}
              />
            )}
          </div>
        </div>

        {filesMemo && (filesMemo?.length > 0 || !!searchParams?.q) && (
          <div className="my-4 mb-8 flex flex-col items-center gap-y-4 lg:flex-row lg:justify-between">
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
              // deletingIds={deletingIds}
              deletingIds={['2']}
              filesMemo={filesMemo}
              isMoreThanMatchLimit={isMoreThanMatchLimit}
              jobTitle={jobTitle}
              onClickSelectFile={(val) => setSelectedFile(val)}
              // onClickSelectFile={(val) => console.log(val, '<<< selected card')}
              onDelete={(id) => deleteFile(id)}
            />
          ) : isLoading ? (
            <div className="mt-8 flex w-full items-start justify-center rounded-lg bg-muted p-8">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label="Pretty empty around here. Let's upload your first document." />
          )}
          {hasNextPage && !isLoading && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                className="text-blue-400"
                onClick={() => fetchNextPage()}
                disabled={isLoading}
                asChild
              >
                Load More
              </Button>
            </div>
          )}
          {/* @ts-ignore */}
          {isLoading && !!filesMemo.length && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="mr-4 animate-spin text-blue-500" />
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
