'use server';

import { openai } from '@/lib/openai';
import { pinecone } from '@/lib/pinecone';
import prismadb from '@/lib/prismadb';
import { checkValidJSON, extractExtension } from '@/lib/utils';
import { ANALYSYS_STATUS } from '@prisma/client';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

const initializeLoader = (fileExtension: string, blob: Blob) => {
  switch (fileExtension) {
    case 'docx':
      return new DocxLoader(blob);
    case 'csv':
      return new CSVLoader(blob);
    case 'pdf':
      return new PDFLoader(blob);
    default:
      throw new Error('Unsupported file type');
  }
};

const createPrompt = (jobDescription: string, keyFocus: string[]) => {
  const keyFocusText = keyFocus.length
    ? `Key focus areas: ${keyFocus.join(', ')}`
    : '';

  return `
    Use the following steps to analyze the CV document based on the provided job description and requirements. Please restate each step before proceeding.

    Step 1: List all the job descriptions and requirements specified by the user. ${keyFocusText}

    Step 2: Analyze the CV document, prioritizing the key focus areas if available. If the key focus areas do not provide sufficient data, use the job description and requirements. Extract all relevant details.

    Step 3: Calculate the match percentage based on how many of the listed requirements are met by the information found in the CV. The calculation should consider all aspects, with particular emphasis on experience and skills. The match percentage should reflect the degree to which the CV meets the job requirements.

    Step 4: Provide a brief reason for the match percentage, focusing on key areas where the CV aligns with or diverges from the job descriptions and requirements. This explanation should not exceed 100 words. If the job descriptions and requirements are not clear, return "The requirements are not clearly defined."

    Step 5: Detect the language used in the job descriptions and requirements. The reason for the match percentage should use the same language as the requirements. If the requirements are in English, use English. If the requirements are in Indonesian, use Indonesian.

    Step 6: Output a JSON object structured as follows:

    {
      "documentOwner": "Name of the CV owner or document author. If the documentOwner is not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'.",
      "matchedPercentage": "Calculated match percentage in integer format without % symbol.",
      "reason": "Brief explanation of the match percentage.",
      "email": "Email of the CV owner or document author. If the email is not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'.",
      "location": "Location of the CV owner or document author. If the location is not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'.",
      "experience": "Experience of the CV owner or document author. If the experience is not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'.",
      "skills": "Skills of the CV owner or document author, separated by '-'. If the skills are not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'.",
      "education": "Last education of the CV owner or document author. If the education is not specified, just return an empty string like ''. Do not return 'Not Specified' or 'Anonymous'."
    }
  `;
};

const analyzeDocument = async (
  docs: any[],
  jobDescription: string,
  cvAnalysisId: string,
  keyFocus?: string[],
) => {
  const index = process.env.NEXT_PUBLIC_PINECONE_INDEX!;
  if (!index) throw new Error('Pinecone index is not defined');

  const pineconeIndex = pinecone.Index(index);
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_API_KEY!,
  });

  const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex,
    namespace: cvAnalysisId,
  });

  const results = await vectorStore.similaritySearch(jobDescription, 4);
  const prompt = createPrompt(jobDescription, keyFocus as string[]);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: `CV Document: ${results.map((r) => r.pageContent).join('\n\n')}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const analyzeCv = async ({
  cvAnalysisId,
  jobId,
}: {
  cvAnalysisId: string;
  jobId: string;
}) => {
  try {
    const cvAnalyze = await prismadb.cvAnalysis.update({
      where: { id: cvAnalysisId },
      data: { status: ANALYSYS_STATUS.ON_ANALYSYS },
      include: { cv: true },
    });
    const job = await prismadb.batchJob.findFirstOrThrow({
      where: { id: jobId },
    });
    const fileUrl = cvAnalyze.cv.url;
    const fileExtension = extractExtension(fileUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch the file');

    if (!fileExtension) throw new Error('File extension is undefined');

    const blob = await response.blob();
    const loader = initializeLoader(fileExtension, blob);
    const pageLevelDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await textSplitter.splitDocuments(pageLevelDocs);

    if (docs.length > 0) {
      const analysisContent = await analyzeDocument(
        docs,
        job.jobDescription,
        cvAnalyze.id,
        job?.keyFocus as string[],
      );
      const isValidJSON = checkValidJSON(analysisContent!);

      if (isValidJSON) {
        const reportOfAnalysis = JSON.parse(analysisContent!);
        await prismadb.cvAnalysis.update({
          data: {
            reportOfAnalysis,
            status: ANALYSYS_STATUS.ANALYSYS,
          },
          where: { id: cvAnalysisId },
        });
      } else {
        throw new Error('Invalid JSON format');
      }
    } else {
      throw new Error('No documents found for analysis');
    }
  } catch (error) {
    console.error('Error analyzing CV:', error);
    await prismadb.cvAnalysis.update({
      where: { id: cvAnalysisId },
      data: { status: ANALYSYS_STATUS.PENDING },
    });
  }
};

export const bulkAnalyzeCv = async ({
  cvAnalysisIds,
  jobId,
}: {
  cvAnalysisIds: string[];
  jobId: string;
}) => {
  return await Promise.all(
    cvAnalysisIds.map((id) => analyzeCv({ cvAnalysisId: id, jobId })),
  );
};
