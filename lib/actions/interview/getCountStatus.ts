import prismadb from '@/lib/prismadb';
import { INVITED_USER_STATUS } from '@prisma/client';
import { Console } from 'console';

export default async function getCountByStatus(interviewCandidatesId: string) {
  // Define the statuses you want to count
  const statuses: INVITED_USER_STATUS[] = [
    'INVITED',
    'SHORTLISTED',
    'REJECTED',
    'COMPLETED',
  ];

  // Create an object to hold the counts
  const countByStatus: { [key in INVITED_USER_STATUS]?: number } = {};

  // Loop through each status and count the records
  for (const status of statuses) {
    const count = await prismadb.invitedUser.count({
      where: {
        interviewCandidatesId: interviewCandidatesId,
        status: status,
      },
    });
    countByStatus[status] = count;
  }
  return countByStatus;
}
