import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import z from 'zod';

const CreateTemplateInterview = z.object({
  organizationId: z.string(),
  batchJobId: z.string().optional().nullable(),
  templateId: z.string(),
  expiredDate: z.string().datetime(),
  candidateName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional().nullable(),
});
export const inviteInterview = async (
  payload: z.infer<typeof CreateTemplateInterview>,
) => {
  try {
    const safePayload = CreateTemplateInterview.parse(payload);
    const template = await prismadb.interviewTemplate.findUniqueOrThrow({
      where: { id: safePayload.templateId },
    });
    const data = await prismadb.invitedUser.create({
      data: {
        ...safePayload,
        result: template?.questions || [],
      },
    });
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
