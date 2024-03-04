import prismadb from "@/lib/prismadb";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { auth } from "@clerk/nextjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest, NextResponse } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { checkValidJSON } from "@/lib/utils";

export const preferredRegion = "sin1";
export const maxDuration = 50;
// export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  try {
    // endpoint for get the result of cv analyzer

    const body = await req.json();

    const { jobTitle, fileId, requirements, percentage } = body;

    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!jobTitle) {
      return new NextResponse("Job Title are required", { status: 400 });
    }

    if (!requirements) {
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

    if (file.uploadStatus === "SUCCESS") {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPEN_API_KEY,
      });

      const index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

      const pineconeIndex = pinecone.Index(index!);

      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        namespace: fileId,
      });

      const results = await vectorStore.similaritySearch(requirements, 4);

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0,
        // stream: true,

        messages: [
          {
            role: "system",
            content: `Use the following steps to analyze the CV document based on the requirements provided. Please restate each step before proceeding.
      
                Step 1: List all the requirements specified by the user, including required experience, skills, educational background, total years of experience, salary expectations, country of origin, current location, visa sponsorship requirements, and age.
                
                Step 2: Analyze the CV document to identify information related to the requirements listed in Step 1. Extract relevant details such as professional experience, skills, educational background, total years of experience, salary expectations, country of origin, current location, visa sponsorship, willingness to do something as mentioned and age.
                
                Step 3: Calculate the match percentage based on how many of the listed requirements are met by the information found in the CV. The calculation should consider all aspects, with particular emphasis on experience and skills. The match percentage should reflect the degree to which the CV meets the job requirements.
                
                Step 4: Provide a brief reason for the match percentage, focusing on key areas where the CV aligns with or diverges from the requirements. This explanation should not exceed 100 words.

                Step 5: The reason of the match percentage should use the same language as used in requirements, if the requirements is on English then use English, if the requirements is on Indonesian Language then use Indonesian Language, if the requirements is use Another Language then use it's language.
                
                Step 6: Output a JSON object structured like: 
                {
                  "documentOwner": "full name of the document owner",
                  "matchedPercentage": "calculated match percentage",
                  "reason": "brief explanation of the match percentage"
                }
                notes:
                - if the documentOwner is not specified, returning empty string like documentOwner: ''.
                - matchedPercentage should in integer format without % symbol

                Step 7: Do not returning each step by step of the process, just the JSON.
                `,
          },
          {
            role: "user",
            content: `CV Document:
        ${results.map((r) => r.pageContent).join("\n\n")}
        
        Requirements Input: ${requirements}`,
          },
        ],
      });

      const isValidJSON = checkValidJSON(response.choices[0].message.content!);
      if (isValidJSON && results.length > 0) {
        const reportOfAnalysis = JSON.parse(
          response.choices[0].message.content!
        );
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
      }
      return NextResponse.json(response.choices[0]);
    } else {
      const reportOfAnalysis = {
        documentOwner: "",
        matchedPercentage: "0",
        reason:
          "The Information on the CV is not clear, this is due to the broken CV format because of the file is containing too much images or the CV is originally PDF Scanned.",
        jobTitle: jobTitle,
        requirements: requirements,
        percentage: percentage,
      };

      await prismadb.file.update({
        data: {
          reportOfAnalysis: reportOfAnalysis,
        },
        where: {
          id: fileId,
        },
      });

      return NextResponse.json(reportOfAnalysis);
    }
  } catch (error) {
    console.log("error api", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
