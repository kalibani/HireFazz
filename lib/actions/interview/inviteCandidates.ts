'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import {
  CreateInviteCandidateSchema,
  type TCreateInviteCandidateSchema,
} from '@/lib/validators/interview';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { sendInviteCandidate } from '../sendEmail/send-invite-candidates';
import { consumeToken } from '../token/consumeToken';

export default async function createInviteCandidates(
  payload: TCreateInviteCandidateSchema,
) {
  try {
    const safedParams = CreateInviteCandidateSchema.parse(payload);
    const { importedCandidates, title, orgId, templateId } = safedParams;

    // Step 1: Find the template from InterviewTemplate based on templateId
    const template = await prismadb.interviewTemplate.findUnique({
      where: { id: templateId },
      select: {
        questions: true,
        title: true,
        introVideoUrl: true,
        descriptionIntro: true,
      },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Step 2: Create InterviewCandidates
    const interviewCandidates = await prismadb.interviewCandidates.create({
      data: {
        templateId,
        organizationId: orgId,
        name: title,
        status: 'OPEN',
      },
    });

    if (!interviewCandidates) {
      throw new Error('Failed to create InterviewCandidates');
    }

    // Step 3: Create InvitedUser records
    const invitedUsersdata = importedCandidates.map((candidate) => {
      const cryptoCode: string = crypto.randomBytes(2).toString('hex'); // Generate a 4-digit string
      return {
        id: candidate.id,
        candidateName: candidate.name,
        email: candidate.email,
        expiredDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Example: setting expiration date to 7 days from now
        organizationId: orgId,
        interviewCandidatesId: interviewCandidates.id,
        result: {
          intro: {
            videoUrl: template.introVideoUrl,
            templateName: template.title,
            name: interviewCandidates.name,
            description: template.descriptionIntro,
          },
          // questions: template.questions as Prisma.InputJsonValue,
          questions: template.questions,
        },
        isUsed: false,
        keyCode: cryptoCode as string,
      };
    });

    // Ensure all records are created successfully
    for (const userData of invitedUsersdata) {
      try {
        const from = 'teams@berrylabs.io';
        const subject = 'Interview Invitation';
        await prismadb.invitedUser.create({
          data: userData,
        });

        const responseEmail = await sendInviteCandidate(
          userData.candidateName,
          userData.email,
          userData.id,
          title,
          from,
          subject,
          userData.keyCode,
        );
        if (responseEmail.error) {
          return { error: responseEmail.error.message };
        }
      } catch (error) {
        console.error(`Failed to insert user: ${userData.email}`, error);
        throw error;
      }
    }
    await consumeToken({ orgId: orgId, amount: importedCandidates.length });
    // // // Step 4: Send invitation emails
    // for (const user of invitedUsersdata) {
    //   const from = 'teams@berrylabs.io';
    //   const subject = 'Interview Invitation';

    //   const responseEmail = await sendInviteCandidate(
    //     user.candidateName,
    //     user.email,
    //     user.id,
    //     from,
    //     subject,
    //     user.keyCode,
    //   );
    //   if (responseEmail.error) {
    //     return { error: responseEmail.error.message };
    //   }
    // }
    revalidatePath('/');
    return { success: 'Candidates Invited', invitedUsersdata };
  } catch (error) {
    errorHandler(error);
  }
}
