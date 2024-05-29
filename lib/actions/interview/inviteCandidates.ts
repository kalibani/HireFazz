'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  CreateInviteCandidateSchema,
  type TCreateInviteCandidateSchema,
} from '@/lib/validators/interview';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { sendInviteCandidate } from '../sendEmail/send-invite-candidates';
import EmailTemplateCandidates from '@/components/email-template/email-template-candidates';
import react from 'react';
import React from 'react';
import { link } from 'fs';

const domain = process.env.NEXT_PUBLIC_APP_URL;

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

    // // Step 4: Send invitation emails
    for (const user of invitedUsers) {
      const from = 'teams@berrylabs.io';
      const subject = 'Interview Invitation';

      await sendInviteCandidate(
        user.candidateName,
        user.email,
        user.id,
        from,
        subject,
      );
    }
    revalidatePath('/');
    return { success: 'Candidates Invited', invitedUsers };
  } catch (error) {
    errorHandler(error);
  }
}
