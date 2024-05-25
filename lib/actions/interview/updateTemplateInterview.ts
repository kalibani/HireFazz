'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { UpdateTemplateInterview } from '@/lib/validators/interview';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export default async function updateTemplate(
  payload: z.infer<typeof UpdateTemplateInterview>,
) {
  try {
    const validatedData = UpdateTemplateInterview.parse(payload);
    if (!validatedData) {
      return { error: 'please recheck the payload' + { payload } };
    }
    const pyloadUpdate = {
      organizationId: validatedData.organizationId,
      title: validatedData.title,
      durationTimeRead: validatedData.durationTimeRead,
      durationTimeAnswered: validatedData.durationTimeAnswered,
      questionRetake: validatedData.questionRetake,
      farewellTitle: validatedData.farewellTitle,
      farewellDescription: validatedData.farewellDescription,
      introVideoUrl: validatedData.introVideoUrl,
      farewellVideoUrl: validatedData.farewellVideoUrl,
      questions: validatedData.questions,
      description: validatedData.description,
      descriptionIntro: validatedData.descriptionIntro,
    };
    await prismadb.interviewTemplate.update({
      where: {
        id: validatedData.id,
      },
      data: pyloadUpdate,
    });
    revalidatePath('/');
    return { success: 'data updated' };
  } catch (error) {
    errorHandler(error);
  }
}
