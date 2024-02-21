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
                  "documentOwner": "full name of the CV owner",
                  "matchedPercentage": "calculated match percentage",
                  "reason": "brief explanation of the match percentage"
                }
                `,
          },
          {
            role: "user",
            content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in json format. Please follow to the Instructions and Restrictions below, you have to answer according to it.
              Instructions:
              You have to calculate how much is the percentage of this cv match with the requirements.
              The answer must be in the same language as the language used in the requirements, for example if it is using english then answer in english, if it is using Indonesian language, answer in Indonesian language and so on.
              The most important factors that affect the calculation result are experience and skills of the document owner.
              The calculation must count all the aspects provided on the document, like relevant experience, educational background, skills, total years of experience, salary expectation, country of origin, current location, Visa Sponsorship, Age, etc.
              The result of the calculation must be written on matchedPercentage!
              The result of the calculation should be different between one and another, depending on the information provided on the cv.
              Restrictions:
              IF the requirements is not clearly defined, matchedPercentage should be 0.
              IF the matched things is not more than 3 things than the matchedPercentage should not more than 60.
              The reason should not more than 100 words.
              The output must be on a json format only, for example: 
              {
                "documentOwner": "full name of the CV owner",
                "matchedPercentage": "calculated match percentage",
                "reason": "brief explanation of the match percentage"
              }
              Do not returning each step by step of the process, just the JSON.
              description:
              documentOwner = name of the document owner, if the name is more than 2 words and more than 20 characters then print only two words plus the first character of the third words, however if the name is more than 2 words but not more than 20 characters then print all the words.
              matchedPercentage: result of the matched percentage in example 10, 20, 25, 30, 35, 45, 50 or 60 or 80, or 90 maximum 100
              reason: reason of the match percentage
              
        \n----------------\n
        
        \n----------------\n
        CV Document:
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
