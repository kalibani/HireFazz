'use server';

import { errorHandler } from '@/helpers';
import { currentUser } from '@/lib/auth';

import prismadb from '@/lib/prismadb';

export const orgList = async () => {
  try {
    const user = await currentUser();
    const list = await prismadb.userOrganization.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });
    return list;
  } catch (error) {
    errorHandler(error);
  }
};
