"use client";

import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useMemo,
  useState,
} from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

import Dropzone from "react-dropzone";
import { Cloud, File, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { Progress } from "./ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useUploadThing } from "@/lib/upload-thing";
import { trpc } from "@/app/_trpc/client";

import { useAnalyzer } from "@/hooks/use-analyzer";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useProModal } from "@/hooks/use-pro-modal";

const UploadDropzone = ({
  isSubscribed,
  setIsOpen,
  isDisabled,
  refetch,
}: {
  isSubscribed: boolean;
  isDisabled: boolean;
  setIsOpen: (v: boolean) => void;
  refetch: () => void;
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressArr, setUploadProgressArr] = useState<number[]>([]);
  const orderUploading = useMemo(() => {
    const ongoing = uploadProgressArr.filter((el) => el > 0);
    return ongoing.length;
  }, [uploadProgressArr]);
  const { startUpload } = useUploadThing("pdfUploader");
  const router = useRouter();
  const { apiLimitCount } = useProModal();
  const { maxFreeCount } = useUser();
  // @ts-ignore
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      if (file.uploadStatus === "SUCCESS") {
        refetch();
        router.refresh();
      }
    },
    retry: true,
    onError(error, variables, context) {
      console.log("e", error, "v", variables, "c", context);
    },
    retryDelay: 200,
    networkMode: "always",
  });

  const startSimulatedProgress = (idx: number) => {
    const interval = setInterval(() => {
      setUploadProgressArr((prevProgressArr) => {
        const prevProgress = prevProgressArr[idx];
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgressArr;
        }
        const updated = [...prevProgressArr].map((el, i) => {
          if (i < idx) return 100;
          if (i === idx) return el + 5;
          return 0;
        });
        return updated;
      });
    }, 200);

    return interval;
  };

  const handleUpload = async (file: File[], idx: number) => {
    const progressInterval = startSimulatedProgress(idx);
    // @ts-ignore
    const res = await startUpload([file]);
    if (!res) {
      return toast.error("Something went wrong");
    }

    const [fileResponse] = res;

    const key = fileResponse?.key;

    if (!key) {
      return toast.error("Something went wrong on file key");
    }
    clearInterval(progressInterval);
    startPolling({ key });
  };

  const handleDropFiles = async (acceptedFiles: any[]) => {
    if (acceptedFiles[0]) {
      if (acceptedFiles.length > maxFreeCount - apiLimitCount) {
        toast.error(
          "Your files is more than remaining quota, please reduce some",
          {
            duration: 5000,
          }
        );
        return;
      }
      const arr = acceptedFiles.map(() => 0);
      setUploadProgressArr(arr);
      acceptedFiles
        .reduce((acc, file, idx) => {
          setIsUploading(true);
          return acc.then(() => {
            return handleUpload(file, idx);
          });
        }, Promise.resolve())
        .then((res: any) => {
          // console.log("res", res);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setIsOpen(false);
        });
    }
  };

  const acceptedFilesType = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    // "text/csv": [".csv"],
  };

  return (
    <Dropzone
      maxFiles={50}
      multiple={true}
      onDrop={handleDropFiles}
      accept={acceptedFilesType}
      disabled={isUploading}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border min-h-64 max-h-[400px] m-4 border-dashed border-gray-300 rounded-lg overflow-auto relative"
        >
          {isUploading && (
            <div className="absolute right-0 flex px-4 py-2 bg-white rounded-lg">
              <span className="mr-2 text-gray-500">{`uploading ${orderUploading}/${uploadProgressArr.length}`}</span>
              <Loader2 className="text-blue-500 animate-spin" />
            </div>
          )}
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center w-full h-full py-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="w-6 h-6 mb-2 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">
                  PDF, DOCX (up to {isSubscribed ? "16" : "4"}MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0]
                ? acceptedFiles.map(
                    (
                      file: {
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                      },
                      indx: number
                    ) => (
                      <div
                        key={indx}
                        className="w-[300px] bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 mb-1"
                      >
                        <div className="grid h-full px-3 py-2 place-items-center">
                          <File className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="h-full px-3 py-2 text-sm truncate">
                          {/* @ts-ignore */}
                          {file.path}
                          {/* @ts-ignore */}
                          {isUploading ? (
                            <div className="w-full max-w-xs mx-auto my-2">
                              <Progress
                                indicatorColor={
                                  uploadProgressArr[indx] === 100
                                    ? "bg-green-500"
                                    : ""
                                }
                                value={uploadProgressArr[indx]}
                                className="w-full h-1 bg-zinc-200"
                              />
                              {/* {uploadProgress === 100 ? (
                            <div className="flex items-center justify-center gap-1 pt-2 text-sm text-center text-zinc-700">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Redirecting...
                            </div>
                          ) : null} */}
                            </div>
                          ) : (
                            <div className="w-full max-w-xs mx-auto my-2">
                              <Progress
                                value={0}
                                className="w-full h-1 bg-zinc-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )
                : null}

              {/* {isUploading ? (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="w-full h-1 bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-sm text-center text-zinc-700">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null} */}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = ({
  isSubscribed,
  buttonText,
  refetch,
}: {
  isSubscribed: boolean;
  buttonText: string;
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { requirements, setRequirements, percentage, setPercentage } =
    useAnalyzer();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>

      <DialogContent className=" min-w-fit lg:min-w-[724px] max-h-screen overflow-auto">
        <div>
          <div className="px-4">
            <label>
              Input your requirements here{" "}
              <span className="text-red-400">*</span>
            </label>
            <Textarea
              className="min-h-[150px] max-h-[400px] overflow-auto mt-2"
              placeholder="Type your requirements here."
              rows={15}
              cols={40}
              maxLength={10000}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between px-4 mt-4">
            <TooltipProvider>
              <label className="mr-2">
                Set Percentage
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="cursor-default ml-1.5">
                    <AlertCircle className="w-4 h-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="p-2 w-80">
                    How many percentage you wanted to match.
                  </TooltipContent>
                </Tooltip>
              </label>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-1.5 w-[250px] hover:bg-transparent"
                  aria-label="zoom"
                  variant="outline"
                >
                  {percentage}%
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px]">
                <DropdownMenuItem onSelect={() => setPercentage(20)}>
                  20%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(40)}>
                  40%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(60)}>
                  60%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(80)}>
                  80%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(100)}>
                  100%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <UploadDropzone
            isSubscribed={isSubscribed}
            setIsOpen={setIsOpen}
            // @ts-ignore
            isDisabled={!requirements}
            refetch={refetch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
