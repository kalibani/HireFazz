"use client";

import { useEffect, useState } from "react";
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
import { MAX_FREE_COUNTS } from "@/constant";
import { useUser } from "@/hooks/use-user";
import { useAnalyzer } from "@/hooks/use-analyzer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReanalyzeModal } from "@/components/reanalyze-modal";
interface AnalyzeCV {
  id: string;
  requirement?: string;
  percentage?: number;
}
const CVAnalyzerPage = () => {
  const { apiLimitCount, onOpen } = useProModal();
  const { subscriptionType } = useUser();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [reanalyzeIds, setReanalyzeIds] = useState<string[]>([]);
  // @ts-ignore
  const { data: files, isLoading } = trpc.getUserFiles
    // @ts-ignore
    .useQuery("_", {
      networkMode: "always",
    });

  // console.log("files", files);

  const utils = trpc.useUtils();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    retry: 3,
    networkMode: "always",
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setDeletingIds([...deletingIds, id]);
    },
    onSettled(data) {
      setDeletingIds(deletingIds.filter((el) => el !== data?.id));
    },
  });

  const isFreeTrialLimited = apiLimitCount === MAX_FREE_COUNTS;

  const { requirements, percentage } = useAnalyzer();

  const analyzeCV = async ({
    id,
    requirement,
    percentage: percentageProp,
  }: AnalyzeCV) => {
    const safeRequirement = requirement || requirements;
    const safePercentage = percentageProp || percentage;
    const messages = `
    Below is the requirements or qualifications or job descriptions that we are looking for:

    ${safeRequirement}
    `;

    try {
      const response = await axios.post("/api/cv-analyzer", {
        message: messages,
        fileId: id,
        requirements: safeRequirement,
        percentage: safePercentage,
      });
      const dataFormatted = JSON.parse(response.data.message.content);

      utils.getUserFiles.invalidate();
    } catch (error: any) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (files?.length) {
      files
        .reduce((acc, item) => {
          return acc.then(() => {
            if (item.reportOfAnalysis) {
              return;
            }
            return analyzeCV({ id: item.id });
          });
        }, Promise.resolve())
        .then((res) => {})
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [files]);

  const isMoreThanMatchLimit = (
    userPercentage: string,
    matchPercentage: string
  ) => {
    return Number(matchPercentage) >= Number(userPercentage);
  };

  const characterLimit = 5000;
  const handleDelete = async (id: string) => {
    deleteFile({ id });
  };
  const handleReanalyze = async (requirement: string, percentage: number) => {
    const fileId = selectedFile;
    setSelectedFile("");
    try {
      setReanalyzeIds([...reanalyzeIds, fileId]);
      await analyzeCV({ id: fileId, requirement, percentage });
    } catch (error) {
    } finally {
      setReanalyzeIds(reanalyzeIds.filter((id) => id !== fileId));
    }
  };
  return (
    <div>
      <Heading
        title="Analyze Your CV"
        description="Revolutionizing CV Analysis."
        icon={FileArchiveIcon}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <div className="p-4 lg:p-8">
        <div>
          <div className="flex items-center justify-between w-full h-16 gap-2 p-4 px-3 border rounded-lg md:px-4 focus-within:shadow-sm">
            <h1 className="mb-3text-gray-900">Start Analyzing</h1>
            {isFreeTrialLimited && subscriptionType !== "PREMIUM" ? (
              <Button onClick={onOpen}>Upload CV</Button>
            ) : (
              <UploadButton
                isSubscribed={true}
                buttonText="Upload CV"
                refetch={() => utils.getUserFiles.invalidate()}
              />
            )}
          </div>
          {/* </Form> */}
        </div>
        <div className="mt-4 space-y-4">
          {/* display all user files */}
          {files && files?.length !== 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-6 mt-8 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                {files
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((file) => (
                    <li
                      key={file.id}
                      className="col-span-1 transition bg-white divide-y divide-gray-200 rounded-lg shadow hover:shadow-lg"
                    >
                      <div className="flex items-center">
                        <Link
                          href={`/cv-analyzer/${file.id}`}
                          className="flex flex-col flex-1 gap-2"
                        >
                          <div className="flex items-center justify-between max-w-[300px] p-4 space-x-6">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                            <div className="flex-1 truncate">
                              <div className="flex items-center space-x-3">
                                <p className="truncate text-lg font-medium text-zinc-900">
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
                                  onClick={() => setSelectedFile(file.id)}
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
                        <div className="flex justify-between gap-6 px-4 py-2 text-sm">
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
                            <div className="flex p-2 text-sm text-zinc-900">
                              Analyzing
                              <MoreHorizontal className="ml-1 mt-0.5 h-4 w-4 shrink-0 opacity-50 animate-ping text-zinc-900" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-10 gap-1 text-sm text-zinc-900">
                              {/* @ts-ignore */}
                              {file.reportOfAnalysis?.matchPercentage}%
                              <p>Match</p>
                              {isMoreThanMatchLimit(
                                // @ts-ignore
                                file.reportOfAnalysis?.percentage,
                                // @ts-ignore
                                file.reportOfAnalysis?.matchPercentage
                              ) ? (
                                <Check className="w-5 h-5 text-green-500 " />
                              ) : (
                                <X className="w-5 h-5 text-red-500 " />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          {!reanalyzeIds.includes(file.id) && (
                            <p className="text-xs text-zinc-500">
                              {/* @ts-ignore */}
                              {file.reportOfAnalysis?.reason}
                            </p>
                          )}
                        </div>
                        {/* <Button
                          onClick={() => deleteFile({ id: file.id })}
                          size="sm"
                          className="float-right"
                          variant="destructive"
                        >
                          {currentlyDeletingFile === file.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </Button> */}
                      </div>
                    </li>
                  ))}
              </ul>

              {/* <Button onClick={handleClick}>Click</Button> */}
            </>
          ) : isLoading ? (
            <div className="flex items-start justify-center w-full p-8 rounded-lg bg-muted">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label="Pretty empty around here. Let's upload your first document." />
          )}
        </div>
      </div>
      <ReanalyzeModal
        open={!!selectedFile}
        onOpenChange={() => setSelectedFile("")}
        onSubmit={handleReanalyze}
      />
    </div>
  );
};

export default CVAnalyzerPage;
