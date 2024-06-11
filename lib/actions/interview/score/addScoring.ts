'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  SchemaAddScoring,
  type TSchemaAddScoring,
} from '@/lib/validators/interview';
import { revalidatePath } from 'next/cache';

export default async function addScoring(payload: TSchemaAddScoring) {
  console.log(payload, '?');
  try {
    const validatedData = SchemaAddScoring.parse(payload);
    if (!validatedData) {
      return { error: 'Error creating or updating score is failed' };
    }
    const { invitedUserId, questionIndex, point, comment, reviewerId } =
      validatedData;

    // Fetch the invited user with their result and scores
    const invitedUser = await prismadb.invitedUser.findUnique({
      where: { id: invitedUserId },
      include: {
        scores: true,
      },
    });

    if (!invitedUser) {
      throw new Error('Invited user not found');
    }

    // Parse the result field as JSON
    const result = invitedUser.result as unknown as {
      questions: { id: string }[];
    };

    // Check if the questionIndex is valid
    if (
      !Array.isArray(result.questions) ||
      questionIndex >= result.questions.length
    ) {
      throw new Error('Invalid question index');
    }

    const questionId = result.questions[questionIndex].id;

    // Check if a score for the specified question already exists
    const existingScore = invitedUser.scores.find(
      (score) => score.questionId === questionId,
    );

    if (existingScore) {
      throw new Error('Score already exists for this question');
    }

    // // Create a new score
    const newScore = await prismadb.score.create({
      data: {
        comment,
        point,
        orgId: invitedUser.organizationId,
        interviewCandidatesId: invitedUser.interviewCandidatesId,
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
