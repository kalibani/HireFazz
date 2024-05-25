'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const PropsDataSchema = z.object({
  id: z.string(),
  queryId: z.string(),
});
type Question = {
  id: string;
};

async function findTemplateById(queryId: string) {
  return prismadb.interviewTemplate.findUnique({
    where: { id: queryId },
  });
}
async function updateTemplateQuestions(queryId: string, questions: Question[]) {
  return prismadb.interviewTemplate.update({
    where: { id: queryId },
    data: { questions },
  });
}

export default async function deleteQuestion(
  payload: z.infer<typeof PropsDataSchema>,
) {
  try {
    const { id, queryId } = PropsDataSchema.parse(payload);

    const template = await findTemplateById(queryId);
    if (!template) {
      return { error: `Template with id ${queryId} not found` };
    }

    if (!template.questions) {
      return { error: `Template with id ${queryId} has no questions` };
    }

    // @ts-ignore
    if (template.questions.length <= 1) {
      return { error: `questions can't deleted` };
    }

    const updatedQuestions =
      // @ts-ignore
      template.questions.filter((question: any) => question.id !== id) || [];
    console.log(updatedQuestions, '<<');
    await updateTemplateQuestions(queryId, updatedQuestions);

    revalidatePath('/');

    return { success: 'Question deleted successfully' };
  } catch (error) {
    return errorHandler(error);
  }
}
