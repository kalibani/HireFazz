'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  SchemaAddScoring,
  type TSchemaAddScoring,
} from '@/lib/validators/interview';
import { revalidatePath } from 'next/cache';

export default async function addScoring(payload: TSchemaAddScoring) {
  try {
    const validatedData = SchemaAddScoring.parse(payload);
    if (!validatedData) {
      return { error: 'Error creating or updating score is failed' };
    }
    const {
      orgId,
      interviewCandidatesId,
      invitedUserId,
      questionId,
      questionIndex,
      point,
      comment,
      reviewerId,
    } = validatedData;

    const existingScore = await prismadb.score.findFirst({
      where: {
        invitedUserId,
        questionId,
        interviewCandidatesId,
        reviewerId,
      },
    });

    if (existingScore) {
      return {
        error: 'Score already exists for this question by this reviewer',
      };
    }
    await prismadb.score.create({
      data: {
        comment,
        point,
        orgId,
        interviewCandidatesId: interviewCandidatesId,
        invitedUserId,
        questionId,
        reviewerId,
      },
    });

    revalidatePath('/[ordId]/video/[id]/detail');
    return { success: 'Review created' };
  } catch (error) {
    console.error('Error creating or updating score:', error);
    // throw new Error('Failed to create or update score');
  }
}
