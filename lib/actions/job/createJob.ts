import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { WORK_MODEL } from '@prisma/client';
import z from 'zod';
import { uploadCv } from '../cv/uploadCv';

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
  analyzeCv: z.boolean()
});

interface FileUpload {
  id: string
  cv: File
}

const connectCvJob = async ({cvId, orgId, batchJobId}: {cvId: string, orgId: string, batchJobId: string}) => {
  try {
    await prismadb.cvAnalysis.create({
      data: {
        cvId,
        orgId,
        batchJobId,    
      }
    })
    
  } catch (error) {
    return errorHandler(error);
  }
}

export const createJob = async (
  payload: z.infer<typeof PayloadAddJob>,
  cv: FileUpload[]
) => {
  try {
    // create Job
    const { analyzeCv, ...safePayload} = PayloadAddJob.parse(payload)
    const job = await prismadb.batchJob.create({
      data: {
        ...safePayload,
      }
    });
    const onSuccess = (props: {id: string, url: string, key: string}) => {
      connectCvJob({cvId: props.id, orgId: safePayload.orgId, batchJobId: job.id})
    }
    cv.forEach(({id, cv}) => {
      uploadCv({id, cv, source: "UPLOAD", orgId: payload.orgId}, onSuccess)
    })

  } catch (error) {
    return errorHandler(error);
  }
};
