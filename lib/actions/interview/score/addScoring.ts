'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  SchemaAddScoring,
  type TSchemaAddScoring,
} from '@/lib/validators/interview';

export default async function addScoring(payload: TSchemaAddScoring) {
  try {
    const validatedData = SchemaAddScoring.parse(payload);
    if (!validatedData) {
      return { error: 'Error creating or updating score is failed' };
    }
    const score = await prismadb.score.upsert({
      where: {
        invitedUserId_questionId_interviewCandidatesId: {
          invitedUserId: validatedData.invitedUserId,
          questionId: validatedData.questionId,
          interviewCandidatesId: validatedData.interviewCandidatesId,
        },
      },
      update: {
        comment: validatedData.comment,
        point: validatedData.point,
        orgId: validatedData.orgId,
        reviewerId: validatedData.reviewerId,
      },
      create: {
        ...validatedData,
      },
    });

    return {success: 'Scoring and review is success'};
  } catch (error) {
    console.error('Error creating or updating score:', error);
    throw new Error('Failed to create or update score');
  }
}
