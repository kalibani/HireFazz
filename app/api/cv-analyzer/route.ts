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

  const { message, fileId, requirements, percentage } = body;

  const { userId } = auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // const { fileId, message } = SendMessageValidator.parse(body);

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

  const index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

  const pineconeIndex = pinecone.Index(index!);

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
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. \nPlease pay attention to the Instructions below, you have to follow the Instructions and answer according to it. \nYou have to calculate how much is the percentage of this cv match with the requirements. The calculation must be count all the aspects provided on the document, like relevant experience, educational background, skills, total years of experience, salary expectation, country of origin, residential place, current location, Visa Sponsorship, Age, etc.\nThe result of the calculation must be written on matchPercentage!
          The result of the calculation should be different between one and another, depending on the information provided on the cv.
          The answer must be in the same language as the language used in the requirements, for example if the requirements is on english language then answer in english, if the requirements is on Indonesian language, answer in Indonesian language and so on.
          IF the requirements is not clearly defined, matchPercentage should be '0'.
          IF the matched things is below than 3 things than the matchPercentage should not more than '70'.
          The answer must be on a json format, for example: 
          {
            documentOwner: 'full name of the owner',
            requirements: ${requirements} Do not change this part,
            percentage: ${percentage} Do not change this part,
            matchPercentage: 'the calculation result of the matched percentage',
            reason: 'reason of the match percentage',
          }
          description:
          documentOwner = name of the document owner
          requirements =  requirements provided by the user. Do not change this part!
          percentage: percentage provided by the user. Do not change this part!
          matchPercentage: result of the matched percentage i.e 50 or 60 or 80, maximum 100
          reason: 'reason of the match percentage.`,
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer. \nPlease pay attention to the Instructions, you have to follow the Instructions and answer according to it.  \nYou have to calculate how much is the percentage of this cv match with the requirements. The calculation must be count all the aspects provided on the document, like relevant experience, educational background, skills, total years of experience, salary expectation, country of origin, residential place, current location, Visa Sponsorship, Age, etc.\nThe result of the calculation must be written on matchPercentage!
        The result of the calculation should be different between one and another, depending on the information provided on the cv.
        The answer must be in the same language as the language used in the requirements, for example if the requirements is on english language then answer in english, if the requirements is on Indonesian language, answer in Indonesian language and so on.
        IF the requirements is not clearly defined, matchPercentage should be '0'.
        IF the matched things is below than 3 things than the matchPercentage should not more than '70'.
        The answer must be on a json format, for example: 
        {
          documentOwner: 'full name of the owner',
          requirements: ${requirements} Do not change this part,
          percentage: ${percentage} Do not change this part,
          matchPercentage: 'the calculation result of the matched percentage',
          reason: 'reason of the match percentage',
        }
        description:
        documentOwner = name of the document owner
        requirements =  requirements provided by the user. Do not change this part!
        percentage: percentage provided by the user. Do not change this part!
        matchPercentage: result of the matched percentage i.e 50 or 60 or 80, maximum 100
        reason: 'reason of the match percentage
        
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
