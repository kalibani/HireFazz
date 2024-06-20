'use server';
import prismadb from '@/lib/prismadb';
import { PayloadAddJob, connectCvJob } from './createJob';
import { uploadCv } from '../cv/uploadCv';
import { z } from 'zod';
import { errorHandler } from '@/helpers';
import { $Enums } from '@prisma/client';

type TReturnType = {
  id: string;
  jobName: string;
  status: 'CREATED';
  orgId: string;
  jobDescription: string;
  location: string;
  createdAt: Date;
  salaryCurrency: string | null;
  salaryRangeFrom: number | null;
  salaryRangeEnd: number | null;
  experience: number | null;
  companyName: string | null;
  workModel: $Enums.WORK_MODEL;
};

export async function createJob(
  payload: z.infer<typeof PayloadAddJob>,
  cv: FormData,
): Promise<TReturnType> {
  try {
    const cvData = cv.getAll('UPLOAD') as File[];
    const cvLinkedin = cv.getAll('LINKEDIN') as string[];

    const { analyzeCv, ...safePayload } = PayloadAddJob.parse(payload);
    const job = await prismadb.batchJob.create({
      data: {
        ...safePayload,
        matchPercentage: safePayload.matchPercentage
          ? Number(safePayload.matchPercentage)
          : undefined,
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
    return job;
  } catch (error) {
    throw errorHandler(error);
  }
}
