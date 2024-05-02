import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import z from 'zod';

const GetTemplateInterview = z.object({
  organizationId: z.string(),
});
export const getTemplateInterview = async (
  payload: z.infer<typeof GetTemplateInterview>,
) => {
  try {
    const safePayload = GetTemplateInterview.parse(payload);
    const data = await prismadb.interviewTemplate.findMany({
      where: {
        ...safePayload,
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
