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

interface InviteOrgProps {
  organizationId: string;
  email: string;
}

export const inviteOrg = async ({ organizationId, email }: InviteOrgProps) => {
  try {
    const inviteUSer = await prismadb.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    const data = await prismadb.userOrganization.create({
      data: {
        organizationId,
        userId: inviteUSer.id,
        roleId: 'MEMBER',
      },
    });

    return data;
  } catch (error) {
    errorHandler(error);
  }
};

export const getOrgMember = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  try {
    const data = await prismadb.userOrganization.findMany({
      where: {
        organizationId,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    errorHandler(error);
  }
};
