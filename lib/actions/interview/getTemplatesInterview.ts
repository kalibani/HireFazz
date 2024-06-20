'use server';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import z from 'zod';

const GetTemplateInterview = z.object({
  organizationId: z.string(),
});

export default async function getTemplateInterview(
  payload: z.infer<typeof GetTemplateInterview>,
) {
  try {
    const safePayload = GetTemplateInterview.parse(payload);
    const data = await prismadb.interviewTemplate.findMany({
      where: {
        ...safePayload,
        isDeleted: false,
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
}
