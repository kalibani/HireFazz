'use server';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

export default async function updateStatusInvitedCandidate(
  id: string,
  status: 'OPEN' | 'CLOSE',
) {
  try {
    const data = await prismadb.interviewCandidates.update({
      where: {
        id,
      },
      select: {
        status: true,
      },
      data: {
        status,
      },
    });
    revalidatePath('/');
    return { success: `status updated ${data.status}` };
  } catch (error) {
    errorHandler(error);
  }
}
