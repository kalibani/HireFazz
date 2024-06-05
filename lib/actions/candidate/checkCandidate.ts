'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

export default async function checkCandidate(id: string) {
  try {
    const candidate = await prismadb.invitedUser.findUnique({
      where: {
        id,
      },
    });
    
    if (!candidate) {
      return { error: 'candidate not valid' };
    }

    revalidatePath('/candidate');
    return { success: 'Congratulation', data: candidate };
  } catch (error) {
    errorHandler(error);
  }
}
