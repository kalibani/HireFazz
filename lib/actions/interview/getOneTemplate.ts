'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export default async function getOneTemplateInterview(id: string) {
  try {
    const data = await prismadb.interviewTemplate.findUnique({
      where: {
        id: id as string,
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
}
