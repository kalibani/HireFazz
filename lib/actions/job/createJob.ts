'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { WORK_MODEL } from '@prisma/client';
import z from 'zod';
import { uploadCv } from '../cv/uploadCv';
import { v4 as uuidv4 } from 'uuid';
import { analyzeCv } from '../cv/analyzeCv';
import { openai } from '@/lib/openai';

const PayloadAddJob = z.object({
  jobName: z.string(),
  location: z.string(),
  salaryCurrency: z.string(),
  salaryRangeFrom: z.number().optional(),
  salaryRangeEnd: z.number().optional(),
  experience: z.number(),
  workModel: z.enum([WORK_MODEL.HYBRID, WORK_MODEL.ONSITE, WORK_MODEL.REMOTE]),
  jobDescription: z.string(),
  companyName: z.string().optional(),
  orgId: z.string(),
  analyzeCv: z.boolean(),
});

const connectCvJob = async ({
  cvId,
  orgId,
  batchJobId,
  analyzeCvEnabled,
}: {
  cvId: string;
  orgId: string;
  batchJobId: string;
  analyzeCvEnabled: boolean;
}) => {
  try {
    const cvAnalyze = await prismadb.cvAnalysis.create({
      data: {
        cvId,
        orgId,
        batchJobId,
      },
    });
    if (analyzeCvEnabled) {
      analyzeCv({ cvAnalysisId: cvAnalyze.id, jobId: batchJobId });
    }
  } catch (error) {
    return errorHandler(error);
  }
};

export const createJob = async (
  payload: z.infer<typeof PayloadAddJob>,
  cv: FormData,
) => {
  try {
    const cvData = cv.getAll('UPLOAD') as File[];
    const cvLinkedin = cv.getAll('LINKEDIN') as string[];

    const { analyzeCv, ...safePayload } = PayloadAddJob.parse(payload);
    const job = await prismadb.batchJob.create({
      data: {
        ...safePayload,
      },
    });

    const onSuccess = (props: { id: string; url: string; key: string }) => {
      connectCvJob({
        cvId: props.id,
        orgId: safePayload.orgId,
        batchJobId: job.id,
        analyzeCvEnabled: analyzeCv,
      });
    };
    cvData.forEach((cv) => {
      uploadCv({ cv, source: 'UPLOAD', orgId: payload.orgId }, onSuccess);
    });
    cvLinkedin.forEach((cv) => {
      uploadCv({ cv, source: 'LINKEDIN', orgId: payload.orgId }, onSuccess);
    });
  } catch (error) {
    return errorHandler(error);
  }
};

export const genereteJobDescription = async (data: any) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-0125-preview',
    temperature: 0,
    // stream: true,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `following the steps to create job description baseon data form provide. restart each step before proceeding. 
        ${data}
        Step 1: read the data form
        step 2: Create simple and cleary informatif job description related base on information from data form
        step 3: output with string html like:
        "<p><strong>Job Description :</strong></p><p>"the output of job description generate"</p><br/>`,
      },
      // {
      //   role: 'user',
      //   content: `CV Document:
      //   ${results.map((r) => r.pageContent).join('\n\n')}

      //   User Input: ${job.jobDescription}
      //   `,
      // },
    ],
  });
  console.log(response, '<<<< AI');
};
