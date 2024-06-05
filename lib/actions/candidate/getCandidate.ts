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
        status: true,
        isUsed: true,
      },
    });
    if (!candidate) {
      return { error: 'Something went wrong' };
    }
    return {
      ...candidate,
    };
  } catch (error) {
    errorHandler(error);
  }
}
