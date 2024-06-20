'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SchemaPayloadDelete = z.object({
  id: z.string().array(),
});

type TSchemaPayloadDelete = z.infer<typeof SchemaPayloadDelete>;

export default async function deleteCandidates(payload: TSchemaPayloadDelete) {
  try {
    const safePayload = SchemaPayloadDelete.parse(payload);
    if (!safePayload)
      return {
        error: 'Delete failed',
      };

    const { id } = safePayload;
    const deleted = await prismadb.invitedUser.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
    revalidatePath('/[orgId]/vide/[id]/invited');
    return { success: `${deleted.count} records deleted` };
  } catch (error) {
    errorHandler(error);
    throw new Error('Delete operation failed' + error);
  }
}
