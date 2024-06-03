'use server';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { idProps } from '@/lib/validators/interview';
import { z } from 'zod';

export default async function getOneCandidate(idProp: z.infer<typeof idProps>) {
  try {
    const { id } = idProps.parse(idProp);
    if (!id) {
      throw new Error('data not found');
    }
    const data = await prismadb.interviewCandidates.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
}
