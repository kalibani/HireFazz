'use server';

import { errorHandler } from '@/helpers';
import { z } from 'zod';
import getCandidate from './getCandidate';
import { blobToFormData } from '@/lib/utils';
import prismadb from '@/lib/prismadb';
import result from 'postcss/lib/result';
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
type TCandidateListSchema = z.infer<typeof candidateSchema>;
const payloadCreateAnswer = z.object({
  id: z.string(),
  url: z.string(),
  questionId: z.string(),
});
type TPayloadCreateAnswer = z.infer<typeof payloadCreateAnswer>;

export default async function createAnswer(payload: TPayloadCreateAnswer) {
  try {
    const safePayload = payloadCreateAnswer.parse(payload);
    if (!safePayload) return { error: 'please check the payload' + payload };
    const { questionId, url, id } = safePayload;
    const candidateResult = await getCandidate(id);

    const validatedCandidate = candidateSchema.parse(candidateResult);
    if (!validatedCandidate) return { error: 'somthing went wrong' };

    // const introVideo = await blobToFormData(url, 'answred');
    console.log({ url });
    let matchedQuestion;
    matchedQuestion = validatedCandidate.questions.find(
      (question: any) => question.id === questionId,
    );
    const existing = validatedCandidate.questions.filter(
      (question: any) => questionId !== question.id,
    );
    if (matchedQuestion) {
      matchedQuestion.answered = url;
    }

    const questionsUpdate = [...existing, matchedQuestion];
    const payloadUpdate = {
      ...validatedCandidate,
      questions: questionsUpdate,
    };
    const candidateOne = await prismadb.invitedUser.findUnique({
      where: {
        id,
      },
    });

    console.log({
      candidateResult,
      payloadUpdate,
      candidateOne,
    });

    await prismadb.invitedUser.update({
      where: {
        id,
      },
      data: { result: payloadUpdate },
    });
    revalidatePath('/candidate');
    return {success:'recorded'}
    // console.log({ candidateResult, validatedCandidate }, candidateResult);
  } catch (error) {
    return errorHandler(error);
  }
}
