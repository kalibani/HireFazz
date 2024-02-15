"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  FileArchiveIcon,
  MoreHorizontal,
  Plus,
  Trash,
  Check,
  X,
  Loader2,
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

const CVAnalyzerPage = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const { apiLimitCount, onOpen } = useProModal();
  const { subscriptionType } = useUser();
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
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  const isFreeTrialLimited = apiLimitCount === MAX_FREE_COUNTS;

  const { requirements, percentage } = useAnalyzer();

  const analyzeCV = async (fileId: string) => {
    const messages = `
    Below is the requirements or qualifications or job descriptions that we are looking for:

    ${requirements}
    `;

    try {
      const response = await axios.post("/api/cv-analyzer", {
        message: messages,
        fileId: fileId,
        requirements: requirements,
        percentage: percentage,
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
            return analyzeCV(item.id);
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

  return (
    <div>
      <Heading
        title="Analyze Your CV"
        description="Revolutionizing CV Analysis."
        icon={FileArchiveIcon}
        iconColor="text-pink-300"
        bgColor="bg-pink-300/10"
      />
      <div className="p-4 lg:p-8">
        <div>
          <div className="rounded-lg w-full border p-4 px-3 md:px-4 focus-within:shadow-sm gap-2 flex h-16 items-center justify-between">
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
        <div className="space-y-4 mt-4">
          {/* display all user files */}
          {files && files?.length !== 0 ? (
            <>
              <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                {files
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((file) => (
                    <li
                      key={file.id}
                      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                    >
                      <div
                        // href={`/summarizer/${file.id}`}
                        className="flex flex-col gap-2"
                      >
                        <div className="p-4 flex w-full items-center justify-between space-x-6">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="truncate text-lg font-medium text-zinc-900">
                                {file.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="px-4 flex justify-between py-2 gap-6 text-sm">
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
                                    <Plus className="h-4 w-4" />
                                    <span>
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

                          {!file.reportOfAnalysis ? (
                            <div className="flex p-2 text-zinc-900 text-sm">
                              Analyzing
                              <MoreHorizontal className="ml-1 mt-0.5 h-4 w-4 shrink-0 opacity-50 animate-ping text-zinc-900" />
                            </div>
                          ) : (
                            <div className="flex gap-1 text-sm text-zinc-900 justify-center items-center h-10">
                              {/* @ts-ignore */}
                              {file.reportOfAnalysis?.matchPercentage}%
                              <p>Match</p>
                              {isMoreThanMatchLimit(
                                // @ts-ignore
                                file.reportOfAnalysis?.percentage,
                                // @ts-ignore
                                file.reportOfAnalysis?.matchPercentage
                              ) ? (
                                <Check className=" h-5 w-5 text-green-500" />
                              ) : (
                                <X className=" h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          {
                            <p className="text-xs text-zinc-500">
                              {/* @ts-ignore */}
                              {file.reportOfAnalysis?.reason}
                            </p>
                          }
                        </div>
                        {/* <Button
                          onClick={() => deleteFile({ id: file.id })}
                          size="sm"
                          className="float-right"
                          variant="destructive"
                        >
                          {currentlyDeletingFile === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button> */}
                      </div>
                    </li>
                  ))}
              </ul>

              {/* <Button onClick={handleClick}>Click</Button> */}
            </>
          ) : isLoading ? (
            <div className="p-8 rounded-lg w-full flex justify-center items-start bg-muted">
              <LoaderGeneral />
            </div>
          ) : (
            <EmptyPage label="Pretty empty around here. Let's upload your first document." />
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalyzerPage;
