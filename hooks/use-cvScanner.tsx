import { trpc } from '@/app/_trpc/client';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAnalyzer } from './use-analyzer';

interface AnalyzeCV {
  id: string;
  jobTitle?: string;
  requirement?: string;
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
  const idsOnAnalyze = useRef<string[]>([]);
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
  }, [filesInfinite?.pages, queryParams]);

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
      idsOnAnalyze.current = [...idsOnAnalyze.current, id];
      await axios.post('/api/cv-analyzer', {
        jobTitle: safeJobTitle,
        fileId: id,
        requirements: safeRequirement,
        percentage: safePercentage,
      });
      utils.infiniteFiles.refetch();
    } catch (error: any) {
      toast.error(error.response.data);
    } finally {
      idsOnAnalyze.current = [...idsOnAnalyze.current].filter(
        (el) => el !== id
      );
    }
  };

  useEffect(() => {
    // @ts-ignore
    const allFiles =
      filesInfinite?.pages.reduce((acc, el) => {
        return [...acc, ...el.items];
      }, []) || [];
    if (allFiles.length) {
      allFiles
        // @ts-ignore
        .reduce((acc, item) => {
          return acc.then(() => {
            if (item.reportOfAnalysis) {
              return;
            }
            if (idsOnAnalyze.current.includes(item.id)) {
              return Promise.resolve();
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
  }, [filesInfinite?.pages]);

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
    jobTitle,
    reanalyzeIds,
    handleReanalyze,
  };
};
