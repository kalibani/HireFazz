'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export default async function getCandidate(id: string) {
  try {
    const candidate = await prismadb.invitedUser.findUnique({
      where: {
        id,
      },
      select: {
        result: true,
      },
    });
    if (!candidate) {
      return { error: 'Something went wrong' };
    }
    return candidate.result;
  } catch (error) {
    errorHandler(error);
  }
}

