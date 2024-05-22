import { z } from 'zod';

export const idProps = z.object({
  id: z.string(),
});

export const Question = z.object({
  timeRead: z.number().optional().nullable(),
  timeAnswered: z.number().optional().nullable(),
  questionRetake: z.number().optional().nullable(),
  title: z.string(),
  question: z.string(),
  videoUrl: z.string(),
  id: z.string(),
});

export const CreateTemplateInterview = z.object({
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
  description: z.string().optional().nullable(),
  descriptionIntro: z.string().optional().nullable(),
});

export const UpdateTemplateInterview = CreateTemplateInterview.extend({
  id: z.string(),
});
