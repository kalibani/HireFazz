'use server';
import prismadb from '@/lib/prismadb';
import { PayloadAddJob, connectCvJob } from './createJob';
import { uploadCv } from '../cv/uploadCv';
import { z } from 'zod';
import { errorHandler } from '@/helpers';

export async function createJob(
  payload: z.infer<typeof PayloadAddJob>,
  cv: FormData,
) {
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

    return job;
  } catch (error) {
    return errorHandler(error);
  }
}
