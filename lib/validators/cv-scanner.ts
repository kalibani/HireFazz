import { z } from 'zod';

export const GetCvValidation = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export const getFilesValidation = z.object({ key: z.string() });
export const deleteFileById = z.object({ id: z.string() });
