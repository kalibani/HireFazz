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
// export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  try {
    // endpoint for get the result of cv analyzer

    const body = await req.json();

    const { jobTitle, message, fileId, requirements, percentage } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!jobTitle) {
      return new NextResponse("Job Title are required", { status: 400 });
    }

    if (!message) {
      return new NextResponse("Requirement are required", { status: 400 });
    }

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
          content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. Please follow to the Instructions and Restrictions below, you have to answer according to it.
        Instructions:
        You have to calculate how much is the percentage of this cv match with the requirements.
        The answer must be in the same language as the language used in the requirements, for example if the requirements is on english language then answer in english, if the requirements is on Indonesian language, answer in Indonesian language and so on.
        The most important factor that affect the value of matchedPercentage should be experience and skills of the document owner.
        The calculation must count all the aspects provided on the document, like relevant experience, educational background, skills, total years of experience, salary expectation, country of origin, current location, Visa Sponsorship, Age, etc.
        The result of the calculation must be written on matchedPercentage!
        The result of the calculation should be different between one and another, depending on the information provided on the cv.
        Restrictions:
        IF the requirements is not clearly defined, matchedPercentage should be '0'.
        IF the matched things is not more than 3 things than the matchedPercentage should not more than '60'.
        The reason should not more than 100 words.
        The answer must be on a json format, for example: 
        {documentOwner: 'full name of the owner',
          matchedPercentage: 'the calculation result of the matched percentage',
          reason: 'reason of the match percentage'}
        description:
        documentOwner = name of the document owner, if the name is more than 2 words and more than 20 characters then print only two words plus the first character of the third words, however if the name is more than 2 words but not more than 20 characters then print all the words. for example if the name 'Muhammad Rizal Herdiyana' then print Muhammad Rizal H because the name is more than 2 words and more than 20 characters.
        matchedPercentage: result of the matched percentage i.e 50 or 60 or 80, maximum 100
        reason: 'reason of the match percentage'`,
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. Please follow to the Instructions and Restrictions below, you have to answer according to it.
        Instructions:
        You have to calculate how much is the percentage of this cv match with the requirements. 
        The answer must be in the same language as the language used in the requirements, for example if the requirements is on english language then answer in english, if the requirements is on Indonesian language, answer in Indonesian language and so on.
        The most important factor that affect the value of matchedPercentage should be experience and skills of the document owner.
        The calculation must count all the aspects provided on the document, like relevant experience, educational background, skills, total years of experience, salary expectation, country of origin, current location, Visa Sponsorship, Age, etc.
        The result of the calculation must be written on matchedPercentage!
        The result of the calculation should be different between one and another, depending on the information provided on the cv.
        Restrictions:
        IF the requirements is not clearly defined, matchedPercentage should be '0'.
        IF the matched things is not more than 3 things than the matchedPercentage should not more than '60'.
        The reason should not more than 100 words.
        The answer must be on a json format, for example: 
        {documentOwner: 'full name of the owner',
          matchedPercentage: 'the calculation result of the matched percentage',
          reason: 'reason of the match percentage'}
        description:
        documentOwner = name of the document owner, if the name is more than 2 words and more than 20 characters then print only two words plus the first character of the third words, however if the name is more than 2 words but not more than 20 characters then print all the words. for example if the name 'Muhammad Rizal Herdiyana' then print Muhammad Rizal H because the name is more than 2 words and more than 20 characters.
        matchedPercentage: result of the matched percentage i.e 50 or 60 or 80, maximum 100
        reason: 'reason of the match percentage'
        
  \n----------------\n
  
  \n----------------\n
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
        },
      ],
    });

    const reportOfAnalysis = JSON.parse(response.choices[0].message.content!);
    const formattedReportOfAnalysis = {
      ...reportOfAnalysis,
      jobTitle: jobTitle,
      requirements: requirements,
      percentage: percentage,
    };

    await prismadb.file.update({
      data: {
        reportOfAnalysis: formattedReportOfAnalysis,
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
  } catch (error) {
    console.log("cv scanner Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
