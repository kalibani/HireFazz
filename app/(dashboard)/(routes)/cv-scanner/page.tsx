"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileArchiveIcon,
  MoreHorizontal,
  Plus,
  Check,
  X,
  Loader2,
  MoreVertical,
} from "lucide-react";
import * as formatter from "date-fns";
import Link from "next/link";
import Heading from "@/components/headings";
import axios from "axios";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/upload-button";

import EmptyPage from "@/components/empty";
import LoaderGeneral from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { trpc } from "@/app/_trpc/client";
import { useUser } from "@/hooks/use-user";
import { useAnalyzer } from "@/hooks/use-analyzer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReanalyzeModal } from "@/components/reanalyze-modal";
import { usePricing } from "@/hooks/use-pricing";
import { pricing } from "@/lib/utils";

const limit = 10;
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
        networkMode: "always",
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
    networkMode: "always",
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
    subscriptionType !== "FREE" && apiLimitCount === maxFreeCount;
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
    const messages = `
    Below is the requirements or qualifications or job descriptions that we are looking for:
    Job Title: ${safeJobTitle} 
    ${safeRequirement}
    `;

    try {
      await axios.post("/api/cv-analyzer", {
        jobTitle: safeJobTitle,
        message: messages,
        fileId: id,
        requirements: safeRequirement,
        percentage: safePercentage,
      });
      utils.infiniteFiles.refetch();
    } catch (error: any) {
      console.log("error", error);
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
    matchPercentage: string
  ) => {
    return Number(matchPercentage) >= Number(userPercentage);
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
        title="CV Scanner"
        description="Scan Hundreds of CVs in Minutes"
        icon={FileArchiveIcon}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <div className="p-4 lg:p-8">
        <div>
          <div className="flex items-center justify-between w-full h-16 gap-2 p-4 px-3 border rounded-lg md:px-4 focus-within:shadow-sm">
            <h1 className="mb-3text-gray-900">Start Analyzing</h1>
            {isQuotaLimited || isFreeTrialLimited ? (
              <Button onClick={handleUpgrade}>Upload CV</Button>
            ) : (
              <UploadButton
                isSubscribed={true}
                buttonText="Upload CV"
                refetch={() => utils.infiniteFiles.refetch()}
              />
            )}
          </div>
          {/* </Form> */}
        </div>
        <div className="mt-4 space-y-4">
          {/* display all user files */}
          {/* @ts-ignore */}
          {filesMemo && filesMemo?.length !== 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-6 mt-8 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                {/* @ts-ignore */}
                {filesMemo.map((file) => (
                  <li
                    key={file.id}
                    className="col-span-1 transition bg-white divide-y divide-gray-200 rounded-lg shadow hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <Link
                        href={`/cv-scanner/${file.id}`}
                        className="flex flex-col flex-1 gap-2"
                      >
                        <div className="flex items-center justify-between max-w-[300px] p-4 space-x-6">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <p className="text-lg font-medium truncate text-zinc-900">
                                {file.name}
                              </p>
                            </div>
                          </div>
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
                                Reanalyze
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                className="w-full text-red-500 border-red-500 hover:text-red-500"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(file.id)}
                              >
                                Delete
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between gap-6 px-4 pt-2 text-base text-zinc-900">
                        <div className="flex items-center gap-2">
                          {
                            <>
                              {/* @ts-ignore */}
                              {file.reportOfAnalysis?.documentOwner ? (
                                <>
                                  <p className="w-full">
                                    {/* @ts-ignore */}
                                    {file.reportOfAnalysis?.documentOwner}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  <span>
                                    {/* @ts-ignore */}
                                    {formatter.format(
                                      new Date(file.createdAt),
                                      "MMM yyyy"
                                    )}
                                  </span>
                                </>
                              )}
                            </>
                          }
                        </div>

                        {!file.reportOfAnalysis ||
                        reanalyzeIds.includes(file.id) ? (
                          <div className="flex p-2 text-base text-zinc-900 items-center">
                            Analyzing
                            <MoreHorizontal className="ml-1 h-4 w-4 shrink-0 opacity-50 animate-ping text-zinc-900" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-10 gap-1 text-base text-zinc-900">
                            {/* @ts-ignore */}
                            {file.reportOfAnalysis?.matchPercentage ??
                              file.reportOfAnalysis?.matchedPercentage}
                            %<p>Match</p>
                            {isMoreThanMatchLimit(
                              // @ts-ignore
                              file.reportOfAnalysis?.percentage,
                              // @ts-ignore
                              file.reportOfAnalysis?.matchPercentage ??
                                file.reportOfAnalysis?.matchedPercentage
                            ) ? (
                              <Check className="w-5 h-5 text-green-500 " />
                            ) : (
                              <X className="w-5 h-5 text-red-500 " />
                            )}
                          </div>
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
