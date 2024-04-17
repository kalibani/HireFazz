import { z } from 'zod';

export const formSchemaCreateJob = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  fromNominal: z.string().optional(),
  toNominal: z.string().optional(),
  experiences: z.string(),
  workModel: z.string(),
  companyName: z.string(),
  currency: z.string(),
});
