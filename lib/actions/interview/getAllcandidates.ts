'use server';

import pagination from '@/components/ui/pagination';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { INVITED_USER_STATUS } from '@prisma/client';
import { Select } from '@radix-ui/react-select';

export default async function getAllCandidates(
  interviewCandidatesId: string,
  page = 1,
  pageSize = 10,
  status?: INVITED_USER_STATUS,
  search?: string,
) {
  // Ensure page and pageSize are valid
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  // Calculate the number of records to skip
  const skip = (page - 1) * pageSize;

  // Construct the where clause with optional status and search parameters
  const whereClause: any = {
    interviewCandidatesId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { candidateName: { contains: search } },
        { email: { contains: search } },
      ],
    }),
  };

  try {
    //Fetch the invited users with the given criteria and pagination
    const invitedUsers = await prismadb.invitedUser.findMany({
      where: whereClause,
      skip: skip,
      take: pageSize,
      include: {
        scores: true,
      },
    });

    // Fetch the total count of records matching the criteria
    const totalCount = await prismadb.invitedUser.count({
      where: whereClause,
    });

    return {
      invitedUsers,
      totalCount,
    };
  } catch (error) {
    errorHandler(error);
  }
}
