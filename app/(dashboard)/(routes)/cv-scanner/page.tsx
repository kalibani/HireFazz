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

// temporary set to 100 for testing purpose
const limit = 100;
interface AnalyzeCV {
  id: string;
  jobTitle?: string;
  requirement?: string;
  percentage?: number;
}
const CVAnalyzerPage = () => {
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
      console.log('error', error);
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
          {/* </Form> */}
        </div>
        {/* @ts-ignore */}
        {filesMemo && filesMemo?.length > 0 ? (
          <div className="flex justify-end gap-1 mt-4 mb-2 mr-1">
            Automatically Sorted by <b>Highest Matched</b>
          </div>
        ) : null}
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
            <div className="flex items-start justify-center w-full p-8 rounded-lg bg-muted">
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
