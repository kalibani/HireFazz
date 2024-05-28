'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { CreateTemplateInterview } from '@/lib/validators/interview';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export default async function createTemplateInterview(
  payload: z.infer<typeof CreateTemplateInterview>,
) {
  try {
    const safePayload = CreateTemplateInterview.parse(payload);
    if (!safePayload) {
      return { error: 'please recheck the payload' + { payload } };
    }
    const data = await prismadb.interviewTemplate.create({
      data: {
        ...safePayload,
      },
    });
    revalidatePath('/');
    return data;
  } catch (error) {
    return errorHandler(error);
  }
}
