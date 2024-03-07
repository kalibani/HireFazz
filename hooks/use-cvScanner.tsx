import { trpc } from '@/app/_trpc/client';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAnalyzer } from './use-analyzer';

interface AnalyzeCV {
  id: string;
  jobTitle?: string;
  requirements?: string;
  percentage?: number;
}

// temporary set to 100 for testing purpose
const limit = 100;

export const useCvScanner = (searchParams?: {
  [key: string]: string | undefined;
}) => {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [reanalyzeIds, setReanalyzeIds] = useState<string[]>([]);
  const { jobTitle, requirements, percentage } = useAnalyzer();

  const queryParams: any = searchParams;

  const {
    data: filesInfinite,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch: refetchInfiniteFiles,
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
    if (!filesInfinite?.pages) {
      return [];
    }
    // @ts-ignore
    const allFiles = filesInfinite?.pages.reduce((acc, el) => {
      return [...acc, ...el.items];
    }, []);

    if (!!queryParams.q) {
      // @ts-ignore
      const filteredData = allFiles.filter((item) => {
        const lowerCaseQuery = queryParams.q.toLowerCase();
        const lowerCaseName = item.name.toLowerCase();
        const lowerCaseDocumentOwner =
          item.reportOfAnalysis?.documentOwner?.toLowerCase() || '';

        return (
          lowerCaseName.includes(lowerCaseQuery) ||
          lowerCaseDocumentOwner.includes(lowerCaseQuery)
        );
      });

      return filteredData;
    }

    return allFiles;
  }, [filesInfinite?.pages, queryParams.q]);

  const utils = trpc.useUtils();

  const { mutateAsync: deleteFile } = trpc.deleteFile.useMutation({
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

  const analyzeCV = useCallback(
    async ({
      id,
      jobTitle: jobTitleProp,
      requirements,
      percentage: percentageProp,
    }: AnalyzeCV) => {
      const safeRequirement = requirements;
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
    },
    [jobTitle, percentage, utils.infiniteFiles]
  );

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
            return analyzeCV({
              id: item.id,
              jobTitle,
              requirements: requirements,
              percentage,
            });
          });
        }, Promise.resolve())
        // @ts-ignore
        .then((res) => {})
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [filesMemo]);

  const handleReanalyze = async (
    jobTitle: string,
    requirements: string,
    percentage: number
  ) => {
    // @ts-ignore
    const fileId = selectedFile.id;
    setSelectedFile({});
    try {
      setReanalyzeIds([...reanalyzeIds, fileId]);
      await analyzeCV({ id: fileId, jobTitle, requirements, percentage });
    } catch (error) {
    } finally {
      setReanalyzeIds(reanalyzeIds.filter((id) => id !== fileId));
    }
  };

  return {
    filesMemo,
    refetchInfiniteFiles,
    isLoading,
    hasNextPage,
    fetchNextPage,
    deletingIds,
    selectedFile,
    setSelectedFile,
    deleteFile,
    jobTitle,
    reanalyzeIds,
    handleReanalyze,
  };
};
