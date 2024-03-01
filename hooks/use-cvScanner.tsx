import { trpc } from '@/src/app/[locale]/_trpc/client';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAnalyzer } from './use-analyzer';
import { queryString } from '@/lib/utils';

interface AnalyzeCV {
  id: string;
  jobTitle?: string;
  requirement?: string;
  percentage?: number;
}

const limit = 10;

export const useCvScanner = (searchParams?: {
  [key: string]: string | undefined;
}) => {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [reanalyzeIds, setReanalyzeIds] = useState<string[]>([]);

  const queryParams: any = searchParams;

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
      let resultFile = filesInfinite?.pages.reduce((acc, el) => {
        return [...acc, ...el.items];
      }, []);

      if (resultFile && !!queryParams.q) {
        // @ts-ignore
        const filteredData = resultFile.filter((item) => {
          return item.name.toLowerCase().includes(queryParams?.q.toLowerCase());
        });
        resultFile = filteredData;
      }
      return resultFile;
    }
    return [];
  }, [filesInfinite?.pages, queryParams]);

  const autoSugession = useMemo(() => {
    if (!!queryParams.q && filesMemo) {
      // @ts-ignore
      const filteredData = filesMemo.filter((item) => {
        return item.name.toLowerCase().includes(queryParams?.q.toLowerCase());
      });
      return filteredData;
    }
  }, [queryParams, filesMemo]);

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
  return {
    filesMemo,
    isLoading,
    hasNextPage,
    fetchNextPage,
    deletingIds,
    selectedFile,
    setSelectedFile,
    deleteFile,
    setReanalyzeIds,
    jobTitle,
    reanalyzeIds,
    handleReanalyze,
    autoSugession,
  };
};
