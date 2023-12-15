"use client";
import ChatWrapper from "@/components/chat/chat-wrapper";
import PdfRenderer from "@/components/pdf-renderer";
import prismadb from "@/lib/prismadb";
// import { getUserSubscriptionPlan } from "@/lib/stripe";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { FileArchiveIcon } from "lucide-react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import Heading from "@/components/headings";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { extractExtension } from "@/lib/utils";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { fileid } = params;

  const {
    data: file,
    fetchStatus,
    isLoading,
  } = trpc.getSingleFile.useQuery(
    {
      fileId: fileid,
    },
    {
      refetchInterval: (file) =>
        file?.uploadStatus === "SUCCESS" || file?.uploadStatus === "FAILED"
          ? false
          : 500,
      networkMode: "always",
    }
  );
  console.log(fetchStatus, file);

  if (!file) toast("File not found");
  const docs = [{ uri: file?.url || "" }];
  const extension = extractExtension(file?.url || "");

  // const plan = await getUserSubscriptionPlan()

  return (
    <div>
      <Heading
        title="Document Summarizer"
        description="Our most advanced conversation model."
        icon={FileArchiveIcon}
        iconColor="text-pink-300"
        bgColor="bg-pink-300/10"
      />

      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-6.5rem)]  bg-gray-200">
        <div className="mx-auto w-full max-w-8xl grow lg:flex ">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              {/* Main area */}
              {extension && extension === "pdf" ? (
                <PdfRenderer url={file?.url || ""} />
              ) : null}
              {extension && extension === "docx" ? (
                <DocViewer
                  pluginRenderers={DocViewerRenderers}
                  documents={docs}
                  theme={{
                    primary: "#5296d8",
                    secondary: "#ffffff",
                    tertiary: "#5296d899",
                    text_primary: "#ffffff",
                    text_secondary: "#5296d8",
                    text_tertiary: "#00000099",
                    disableThemeScrollbar: false,
                  }}
                  className="flex-1 w-full max-h-[60vh]"
                />
              ) : null}
            </div>
          </div>

          <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper isSubscribed={true} fileId={file?.id || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
