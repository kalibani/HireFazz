import ChatWrapper from '@/components/chat/chat-wrapper';
import PdfRenderer from '@/components/pdf-renderer';
import FilesRenderer from '@/components/files-renderer';
import prismadb from '@/lib/prismadb';
// import { getUserSubscriptionPlan } from "@/lib/stripe";
import { notFound, redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

import Heading from '@/components/headings';
import { extractExtension } from '@/lib/utils';

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  // const { userId } = auth();

  const file = await prismadb.file.findFirst({
    where: {
      id: fileid,
      // userId,
    },
  });

  if (!file) notFound();

  const fileExtension = extractExtension(file.url);

  // const plan = await getUserSubscriptionPlan()

  return (
    <div>
      <Heading
        title="CV Screener"
        description="Screening Hundreds of CVs in mere Minutes"
        icon={FileText}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />

      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-6.5rem)] bg-gray-200">
        <div className="mx-auto w-full max-w-8xl grow lg:flex ">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              {/* Main area */}
              {fileExtension === 'pdf' ? (
                <PdfRenderer url={file.url} />
              ) : (
                <FilesRenderer url={file.url} fileExtension={fileExtension!} />
              )}
            </div>
          </div>

          {/* <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper isSubscribed={true} fileId={file.id} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
