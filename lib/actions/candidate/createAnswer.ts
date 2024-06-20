'use server';

import { errorHandler } from '@/helpers';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

const candidateSchema = z.object({
  intro: z.object({
    name: z.string(),
    videoUrl: z.string(),
    description: z.string(),
    templateName: z.string(),
  }),
  questions: z.any(),
});

const payloadCreateAnswer = z.object({
  id: z.string(),
  url: z.string(),
  questionId: z.string(),
  indexQuestion: z.number(),
});
type TPayloadCreateAnswer = z.infer<typeof payloadCreateAnswer>;

export default async function createAnswer(payload: TPayloadCreateAnswer) {
  try {
    const safePayload = payloadCreateAnswer.parse(payload);
    if (!safePayload) return { error: 'please check the payload' + payload };
    const { questionId, url, id, indexQuestion } = safePayload;
    const candidateResult = await prismadb.invitedUser.findUnique({
      where: {
        id,
      },
      select: {
        result: true,
      },
    });

    const validatedCandidate = candidateSchema.parse(candidateResult?.result);
    if (!validatedCandidate) return { error: 'something went wrong' };

    const cekIdQuestion = validatedCandidate.questions.some(
      (question: any) => question.id === questionId,
    );
    if (!cekIdQuestion) return { error: 'data not valid' };
    const newQuestion = validatedCandidate.questions;
    newQuestion[indexQuestion] = {
      ...newQuestion[indexQuestion],
      answered: url,
    };
    const payloadUpdate = {
      ...validatedCandidate,
      questions: newQuestion,
    };
    await prismadb.invitedUser.update({
      where: {
        id,
      },
      data: { result: payloadUpdate },
    });
    revalidatePath('/candidate');
    return { success: 'recorded' };
  } catch (error) {
    return errorHandler(error);
  }
}
