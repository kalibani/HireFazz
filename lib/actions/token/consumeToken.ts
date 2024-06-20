'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export const consumeToken = async ({
  orgId,
  amount,
}: {
  orgId: string;
  amount?: number;
}) => {
  try {
    const org = await prismadb.organization.update({
      where: { id: orgId },
      data: {
        used: {
          increment: amount || 1,
        },
      },
    });

    return org;
  } catch (error) {
    errorHandler(error);
  }
};

export const getTokens = async ({ orgId }: { orgId: string }) => {
  try {
    const org = await prismadb.organization.findUnique({
      where: { id: orgId },
    });

    return {
      limit: org?.limit,
      used: org?.used,
      availableTokens: (org?.limit || 0) - (org?.used || 0),
    };
  } catch (error) {
    errorHandler(error);
  }
};
