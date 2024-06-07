import prismadb from '@/lib/prismadb';
import { INVITED_USER_STATUS } from '@prisma/client';

export default async function getCountByStatus(interviewCandidatesId: string) {
  const statuses: INVITED_USER_STATUS[] = [
    'INVITED',
    'SHORTLISTED',
    'REJECTED',
    'COMPLETED',
  ];

  const countByStatus: { [key in INVITED_USER_STATUS]?: number } = {};

  await Promise.all(
    statuses.map(async (status) => {
      const count = await prismadb.invitedUser.count({
        where: {
          interviewCandidatesId: interviewCandidatesId,
          status: status,
        },
      });
      countByStatus[status] = count;
    }),
  );

  return { countByStatus };
}
