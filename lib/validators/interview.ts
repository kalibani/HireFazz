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
  isDeleted: z.boolean().optional(),
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

export const DetailCandidate = z.object({
  id: z.string(),
  templateId: z.string(),
  batchJobId: z.string().optional().nullable(),
  organizationId: z.string(),
  name: z.string(),
  status: z.string(),
});
export type TDetailCandidate = z.infer<typeof DetailCandidate>;

export const ResponseInvitedUser = z.object({
  id: z.string(),
  candidateName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  result: z.any(),
  status: z.enum(['INVITED', 'COMPLETED', 'SHORTLISTED', 'REJECTED']),
  createdAt: z.date(),
  expiredDate: z.date(),
  organizationId: z.string(),
  interviewCandidatesId: z.string(),
  isUsed: z.boolean(),
  keyCode: z.string(),
  scor: z.number().optional(),
});
export type TResponseInvitedUser = z.infer<typeof ResponseInvitedUser>;

export const ResponseAllCandidates = z.object({
  invitedUsers: z.array(ResponseInvitedUser),
  totalCount: z.number(),
});
export type TResponseAllCandidates = z.infer<typeof ResponseAllCandidates>;
