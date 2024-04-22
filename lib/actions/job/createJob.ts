'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { WORK_MODEL } from '@prisma/client';
import z from 'zod';
import { uploadCv } from '../cv/uploadCv';
import { v4 as uuidv4 } from 'uuid';
import { analyzeCv } from '../cv/analyzeCv';
import { openai } from '@/lib/openai';
import { checkValidJSON } from '@/lib/utils';
import { formSchemaCreateJob } from '@/lib/validators/createJob';

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

export const genereteJobDescription = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  try {
    const prompt = `
    following the steps to create job description based on provided data. Restart each step before proceeding.
    Data:
    ${JSON.stringify(data)}

    Step 1: Read the data.
    Step 2: Create a simple and clear job description based on the provided information.

     Output a JSON object structured like: 
    {
      "result":"the result output of job description generate"
    }
  `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: 'create job description.',
        },
      ],
    });

    const isValidJSON = checkValidJSON(response.choices[0].message.content!);
    if (isValidJSON) {
      const res = JSON.parse(response.choices[0].message.content!);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

export const generateSkill = async (title: string) => {
  try {
    const prompt = `
    following the steps to create Skill based on provided data. Restart each step before proceeding.
    Data:
    ${JSON.stringify({ title })}

    Step 1: Read the data.
    Step 2: Create a simple and clear Skill set based on the provided information.

     Output a JSON object structured like: 
    {
      "result":"the result output of skill set generate"
    }
  `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: 'create skill set.',
        },
      ],
    });

    const isValidJSON = checkValidJSON(response.choices[0].message.content!);
    if (isValidJSON) {
      const res = JSON.parse(response.choices[0].message.content!);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

export const generateResponsibilities = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  const { title, experiences, workModel } = data;
  try {
    const prompt = `
    following the steps to create Responsibilities based on provided data. Restart each step before proceeding.
    Data:
    ${JSON.stringify({ title, experiences, workModel })}

    Step 1: Read the data.
    Step 2: Create a simple and clear Responsibilities based on the provided information.

     Output a JSON object structured like: 
    {
      "result":"the result output of Responsibilities generate"
    }
  `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: 'create Responsibilities.',
        },
      ],
    });

    const isValidJSON = checkValidJSON(response.choices[0].message.content!);
    if (isValidJSON) {
      const res = JSON.parse(response.choices[0].message.content!);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};
export const generateRequirement = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  try {
    const prompt = `
    following the steps to create Requirement based on provided data. Restart each step before proceeding.
    Data:
    ${JSON.stringify(data)}

    Step 1: Read the data.
    Step 2: Create a simple and clear Requirement based on the provided information.

     Output a JSON object structured like: 
    {
      "result":"the result output of Requirement generate"
    }
  `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: 'create Requirement.',
        },
      ],
    });

    const isValidJSON = checkValidJSON(response.choices[0].message.content!);
    if (isValidJSON) {
      const res = JSON.parse(response.choices[0].message.content!);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

