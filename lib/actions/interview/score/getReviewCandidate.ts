'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export default async function getReviewCandidate(
  invitedUserId: string,
  interviewCandidateId: string,
) {
  try {
    if (!invitedUserId || !interviewCandidateId) {
      return { error: 'candidate not found' };
    }
    const candidate = await prismadb.invitedUser.findUnique({
      where: {
        id: invitedUserId,
      },
      select: {
        candidateName: true,
        email: true,
        result: true,
        status: true,
        scores: {
          select: {
            id: true,
            point: true,
            reviewer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!candidate || !candidate.result) {
      return { error: 'candidate not found' };
    }
    return candidate;
  } catch (error) {
    throw new Error('Failed to fetch candidate data');
  }
}
