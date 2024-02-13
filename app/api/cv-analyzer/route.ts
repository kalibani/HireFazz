import prismadb from "@/lib/prismadb";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { auth } from "@clerk/nextjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest, NextResponse } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";

export const preferredRegion = "sin1";
export const maxDuration = 50;

export const POST = async (req: NextRequest) => {
  // endpoint for get the result of cv analyzer

  const body = await req.json();

  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await prismadb.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  // await prismadb.message.create({
  //   data: {
  //     text: message,
  //     isUserMessage: true,
  //     userId,
  //     fileId,
  //   },
  // });

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  const pineconeIndex = pinecone.Index("genio");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: fileId,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  // const prevMessages = await prismadb.message.findMany({
  //   where: {
  //     fileId,
  //   },
  //   orderBy: {
  //     createdAt: "asc",
  //   },
  //   take: 6,
  // });

  // const formattedPrevMessages = prevMessages.map((msg) => ({
  //   role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
  //   content: msg.text,
  // }));

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0,
    // stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. \nPlease pay attention to the Instructions, you have to follow the Instructions and answer according to it.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer. \nPlease pay attention to the Instructions, you have to follow the Instructions and answer according to it. 
        
  \n----------------\n
  
  \n----------------\n
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  const reportOfAnalysis = JSON.parse(response.choices[0].message.content!);

  await prismadb.file.update({
    data: {
      reportOfAnalysis: reportOfAnalysis,
    },
    where: {
      id: fileId,
    },
  });

  // const stream = OpenAIStream(response, {
  //   async onCompletion(completion) {
  //     await prismadb.message.create({
  //       data: {
  //         text: completion,
  //         isUserMessage: false,
  //         fileId,
  //         userId,
  //       },
  //     });
  //   },
  // });

  // return new StreamingTextResponse(stream);
  return NextResponse.json(response.choices[0]);
};
