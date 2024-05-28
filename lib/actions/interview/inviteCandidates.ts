'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  CreateInviteCandidateSchema,
  type TCreateInviteCandidateSchema,
} from '@/lib/validators/interview';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function createInviteCandidates(
  payload: TCreateInviteCandidateSchema,
) {
  try {
    const safedParams = CreateInviteCandidateSchema.parse(payload);
    const { importedCandidates, title, orgId, templateId } = safedParams;

    // Step 1: Find the template from InterviewTemplate based on templateId
    const template = await prismadb.interviewTemplate.findUnique({
      where: { id: templateId },
      select: { questions: true },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    const questions = template.questions;

    // Step 2: Create InterviewCandidates
    const interviewCandidates = await prismadb.interviewCandidates.create({
      data: {
        templateId,
        organizationId: orgId,
        name: title,
        status: 'OPEN',
      },
    });

    // Step 3: Create InvitedUser records
    const invitedUsers = importedCandidates.map((candidate) => ({
      id: candidate.id,
      candidateName: candidate.name,
      email: candidate.email,
      expiredDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Example: setting expiration date to 7 days from now
      organizationId: orgId,
      interviewCandidatesId: interviewCandidates.id,
      result: questions as Prisma.InputJsonValue,
    }));

    await prismadb.invitedUser.createMany({
      data: invitedUsers,
    });
    revalidatePath('/');
    // return { interviewCandidates, invitedUsers };
    return { success: 'Candidates Invited' };
  } catch (error) {
    errorHandler(error);
  }
}
