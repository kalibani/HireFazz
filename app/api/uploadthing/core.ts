import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import prismadb from "@/lib/prismadb";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { pinecone } from "@/lib/pinecone";
import { extractExtension } from "@/lib/utils";
import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { increaseApiLimit } from "@/lib/api-limit";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

const middleware = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  // const freeTrial = await checkApiLimit();

  // if (!freeTrial) throw new Error("Free Trial has expired");

  return {
    // freeTrial: freeTrial,
    userId: userId,
  };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // const isFileExist = await prismadb.file.findFirst({
  //   where: {
  //     key: file.key,
  //   },
  // });

  // if (isFileExist) return;

  try {
    const fileUrl = `https://uploadthing-prod-icn1.s3.ap-northeast-2.amazonaws.com/${file.key}`;
    const fileExtension = extractExtension(fileUrl);
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // const fileText = await blob.text();
    // let loader = new UnstructuredLoader(fileUrl);
    let loader;
    switch (fileExtension) {
      case "docx":
        loader = new DocxLoader(blob);
        break;
      case "csv":
        loader = new CSVLoader(blob);
        break;
      default:
        loader = new PDFLoader(blob);
        break;
    }

    const pageLevelDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(pageLevelDocs);

    // const pagesAmt = pageLevelDocs.length;

    // const { subscriptionPlan } = metadata
    // const { isSubscribed } = subscriptionPlan

    // const isProExceeded =
    //   pagesAmt >
    //   PLANS.find((plan) => plan.name === 'Premium')!.pagesPerPdf
    // const isFreeExceeded =
    //   pagesAmt >
    //   PLANS.find((plan) => plan.name === 'Free')!
    //     .pagesPerPdf

    // if (
    //   (isSubscribed && isProExceeded) ||
    //   (!isSubscribed && isFreeExceeded)
    // ) {
    //   await prismadb.file.update({
    //     data: {
    //       uploadStatus: 'FAILED',
    //     },
    //     where: {
    //       id: createdFile.id,
    //     },
    //   })
    // }

    // vectorize and index entire document

    const index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

    const pineconeIndex = pinecone.Index(index!);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPEN_API_KEY,
    });

    const createdFile = await prismadb.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://uploadthing-prod-icn1.s3.ap-northeast-2.amazonaws.com/${file.key}`,
        uploadStatus: "SUCCESS",
      },
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
      textKey: "text",
    });

    await increaseApiLimit(metadata.userId);
  } catch (err) {
    console.log("err", err);

    throw new NextResponse("Invalid file structure", { status: 400 });
  }
};

export const ourFileRouter = {
  pdfUploader: f({
    image: { maxFileSize: "4MB" },
    text: { maxFileSize: "4MB" },
    "application/docbook+xml": { maxFileSize: "16MB" },
    "text/csv": { maxFileSize: "16MB" },
    pdf: { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "16MB",
    },
  })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  // proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
  //   .middleware(middleware)
  //   .onUploadComplete(async ({ metadata, file }) => {
  //     const createdFile = await prismadb.file.create({
  //       data: {
  //         key: file.key,
  //         name: file.name,
  //         userId: metadata.userId,
  //         url: `https://uploadthing-prod-icn1.s3.ap-northeast-2.amazonaws.com/${file.key}`,
  //         uploadStatus: "PROCESSING",
  //       },
  //     });
  //   }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
