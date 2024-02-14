"use client";

import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
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
  const [files, setFiles] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload } = useUploadThing("pdfUploader");
  // @ts-ignore
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      if (file.uploadStatus === "SUCCESS") {
        refetch();
        // setIsOpen(false);
      }
    },
    retry: true,
    onError(error, variables, context) {
      console.log("e", error, "v", variables, "c", context);
    },
    retryDelay: 500,
    networkMode: "always",
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const handleUpload = async (file: File[]) => {
    // handle file uploading
    // @ts-ignore
    const res = await startUpload([file]);

    if (!res) {
      return toast("Something went wrong");
    }

    const [fileResponse] = res;

    const key = fileResponse?.key;

    if (!key) {
      return toast("Something went wrong on file key");
    }

    startPolling({ key });
  };

  const handleDropFiles = async (acceptedFiles: any[]) => {
    if (acceptedFiles[0]) {
      const progressInterval = startSimulatedProgress();

      acceptedFiles
        .reduce((acc, file) => {
          setIsUploading(true);
          return acc.then(() => {
            return handleUpload(file);
          });
        }, Promise.resolve())
        .then((res: any) => {
          // console.log("res", res);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          setIsOpen(false);
        });

      // console.log("-->", acceptedFiles);
      // setIsUploading(true);

      // const progressInterval = startSimulatedProgress();

      // handle file uploading
      // const res = await startUpload(acceptedFiles);

      // if (!res) {
      //   return toast("Something went wrong");
      // }

      // const [fileResponse] = res;

      // const key = fileResponse?.key;

      // if (!key) {
      //   return toast("Something went wrong key");
      // }

      // clearInterval(progressInterval);
      // setUploadProgress(100);

      // startPolling({ key });
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
      maxFiles={20}
      multiple={true}
      onDrop={handleDropFiles}
      accept={acceptedFilesType}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border min-h-64 max-h-[400px] m-4 border-dashed border-gray-300 rounded-lg overflow-auto"
        >
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 py-2">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
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
                    (file: {
                      name:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | PromiseLikeOfReactNode
                        | null
                        | undefined;
                    }) => (
                      <>
                        <div className="w-[300px] bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 mb-1">
                          <div className="px-3 py-2 h-full grid place-items-center">
                            <File className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="px-3 py-2 h-full text-sm truncate">
                            {/* @ts-ignore */}
                            {file.path}
                            {/* @ts-ignore */}
                            {isUploading ? (
                              <div className="w-full my-2 max-w-xs mx-auto">
                                <Progress
                                  indicatorColor={
                                    uploadProgress === 100 ? "bg-green-500" : ""
                                  }
                                  value={uploadProgress}
                                  className="h-1 w-full bg-zinc-200"
                                />
                                {/* {uploadProgress === 100 ? (
                            <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Redirecting...
                            </div>
                          ) : null} */}
                              </div>
                            ) : (
                              <div className="w-full my-2 max-w-xs mx-auto">
                                <Progress
                                  value={0}
                                  className="h-1 w-full bg-zinc-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )
                  )
                : null}

              {/* {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
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
          <div className="px-4 mt-4 flex justify-between items-center">
            <TooltipProvider>
              <label className="mr-2">
                Set Percentage
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="cursor-default ml-1.5">
                    <AlertCircle className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-2">
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
                  <ChevronDown className="h-3 w-3 opacity-50" />
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
