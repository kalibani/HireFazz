import { TypeOf, z } from 'zod';

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

export const DeleteDataSchema = z.object({
  id: z.string(),
  queryId: z.string(),
});

export const InterviewDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  descriptionIntro: z.string().optional(),
  introVideoUrl: z.string().optional(),
  questions: Question.optional(),
});
export type TInterview = z.infer<typeof InterviewDataSchema>;

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const CreateInviteCandidateSchema = z.object({
  importedCandidates: CandidateSchema.array(),
  title: z.string(),
  orgId: z.string(),
  templateId: z.string(),
});

export type TCreateInviteCandidateSchema = z.infer<
  typeof CreateInviteCandidateSchema
>;
export type TCandidateSchema = z.infer<typeof CandidateSchema>;

export const CandidateListSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  name: z.string(),
  status: z.string(),
  candidates: z.any().array(),
  candidatesCount: z.number(),
  templateName: z.string(),
});
export type TCandidateListSchema = z.infer<typeof CandidateListSchema>;
