'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  type TSchemaUpdateStatusCandidate,
  SchemaUpdateStatusCandidate,
} from '@/lib/validators/interview';
import { INVITED_USER_STATUS } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function updateStatusCandidate(
  payload: TSchemaUpdateStatusCandidate,
) {
  try {
    const safePayload = SchemaUpdateStatusCandidate.parse(payload);
    if (!safePayload) return { error: ' Candidate not found' };
    const { id, status } = safePayload;
    const updated = await prismadb.invitedUser.updateMany({
      where: {
        id: {
          in: id,
        },
      },
      data: {
        status: status as INVITED_USER_STATUS,
      },
    });
    revalidatePath('/[orgId]/video/[id]/[tab]');
    return {
      success: `Success updated ${updated.count} ${updated.count === 1 ? 'candidate' : 'candidates'}`,
    };
  } catch (error) {
    errorHandler(error);
  }
}
