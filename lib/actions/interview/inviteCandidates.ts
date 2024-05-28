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

// // Example usage
// const payload = {
//   importedCandidates: [
//     {
//       id: '17772422-af76-4d9f-bc61-337942273827',
//       name: 'dimas',
//       email: 'dimas@dimas.com',
//     },
//     {
//       id: '6b87850b-edf9-47bc-8d2b-a2fe2e72b191',
//       name: 'adada',
//       email: 'adada@ad.com',
//     },
//   ],
//   title: 'ok',
//   orgId: 'clw0ai1vm000074a13acvt49q',
//   templateId: 'clwhusspr00018oq2yyukv5l1',
// };

// createInterview(payload)
//   .then((result) => {
//     console.log('Interview created successfully', result);
//   })
//   .catch((error) => {
//     console.error('Error creating interview', error);
//   })
//   .finally(() => {
//     prismadb.$disconnect();
//   });
