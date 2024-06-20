import { TFunction } from '@/i18n';
import { WORK_MODEL } from '@prisma/client';
import { z } from 'zod';

export const getFormSchemaCreateJob = (t: TFunction) =>  z.object({
  title: z.string().min(2, {
    message: t('error_jobTitle'),
  }),
  location: z.string().min(2, {
    message: t('error_location'),
  }),
  fromNominal: z.string().optional(),
  toNominal: z.string().optional(),
  experiences: z.string(),
  workModel: z.enum([WORK_MODEL.HYBRID, WORK_MODEL.ONSITE, WORK_MODEL.REMOTE, WORK_MODEL.FREELANCE, WORK_MODEL.INTERNSHIP, WORK_MODEL.PART_TIME, WORK_MODEL.CONTRACT]),
  companyName: z.string(),
  currency: z.string(),
});

export type FormSchemaCreateJob = ReturnType<typeof getFormSchemaCreateJob>