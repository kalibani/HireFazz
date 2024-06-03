'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

export default async function checkingOtpCandidate(otp: string, id: string) {
  try {
    const candidate = await prismadb.invitedUser.findUnique({
      where: {
        id,
        keyCode: otp,
      },
    });
    if (!candidate) {
      return { error: 'code not valid' };
    }

    const currentDate = new Date();
    if (
      candidate.expiredDate &&
      new Date(candidate.expiredDate) < currentDate
    ) {
      await prismadb.invitedUser.update({
        where: {
          id,
          keyCode: otp,
        },
        data: {
          status: 'EXPIRED',
          isUsed: true,
        },
      });
    } else {
      await prismadb.invitedUser.update({
        where: {
          id,
          keyCode: otp,
        },
        data: {
          status: 'OPEN',
          isUsed: true,
        },
      });
    }

    revalidatePath('/candidate');
    return { success: 'Congratulation' };
  } catch (error) {
    errorHandler(error);
  }
}
