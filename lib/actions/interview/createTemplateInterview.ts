import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import z from 'zod';

const Question = z.object({
  durationTimeRead: z.number().optional().nullable(),
  durationTimeAnswered: z.number().optional().nullable(),
  questionRetake: z.number().optional().nullable(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
});

const CreateTemplateInterview = z.object({
  organizationId: z.string(),
  title: z.string(),
  durationTimeRead: z.number(),
  durationTimeAnswered: z.number(),
  questionRetake: z.number().optional().nullable(),
  farewellTitle: z.string().optional().nullable(),
  farewellDescription: z.string().optional().nullable(),
  introVideoUrl: z.string().optional().nullable(),
  farewellVideoUrl: z.string().optional().nullable(),
  questions: z.array(Question),
});
export const createTemplateInterview = async (
  payload: z.infer<typeof CreateTemplateInterview>,
) => {
  try {
    const safePayload = CreateTemplateInterview.parse(payload);
    const data = await prismadb.interviewTemplate.create({
      data: {
        ...safePayload,
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
