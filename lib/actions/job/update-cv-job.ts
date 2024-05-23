'use server';
import { z } from 'zod';
import { errorHandler } from '@/helpers';
import { uploadCv } from '../cv/uploadCv';
import { connectCvJob } from './createJob';

const PayloadUpdateJobCvs = z.object({
  jobId: z.string(),
  orgId: z.string(),
  analyzeCv: z.boolean().optional(),
});

type TUpdateCvPayload = z.infer<typeof PayloadUpdateJobCvs>;

export async function updateJobCvs(
  payload: TUpdateCvPayload,
  cv: FormData,
): Promise<void> {
  try {
    const cvData = cv.getAll('UPLOAD') as File[];
    const cvLinkedin = cv.getAll('LINKEDIN') as string[];

    const { analyzeCv, ...safePayload } = PayloadUpdateJobCvs.parse(payload);

    const onSuccess = (props: { id: string; url: string; key: string }) => {
      connectCvJob({
        cvId: props.id,
        orgId: safePayload.orgId,
        batchJobId: safePayload.jobId,
        analyzeCvEnabled: analyzeCv as boolean,
      });
    };

    cvData.forEach((cv) => {
      uploadCv({ cv, source: 'UPLOAD', orgId: payload.orgId }, onSuccess);
    });

    cvLinkedin.forEach((cv) => {
      uploadCv({ cv, source: 'LINKEDIN', orgId: payload.orgId }, onSuccess);
    });
  } catch (error) {
    throw errorHandler(error);
  }
}
