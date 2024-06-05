'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

interface ValidateRefferalCodeProps {
  code: string;
  orgId: string;
}

export const validateRefferalCode = async ({
  code,
  orgId,
}: ValidateRefferalCodeProps) => {
  try {
    const data = await prismadb.referral.findUniqueOrThrow({ where: { code } });
    const checkDuplicateRefferal = await prismadb.topup.findUnique({
      where: {
        referralCode_orgId: {
          orgId,
          referralCode: code,
        },
      },
    });
    if (checkDuplicateRefferal) throw new Error('Invalid Code');
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
