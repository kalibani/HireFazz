'use server';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { idProps } from '@/lib/validators/interview';
import z from 'zod';

export default async function getInvitedCandidates(
  orgId: z.infer<typeof idProps>,
) {
  try {
    const safePayload = idProps.parse(orgId);
    const { id } = safePayload;

    const data = await prismadb.interviewCandidates.findMany({
      where: {
        organizationId: id,
      },
      include: {
        candidates: true,
      },

      orderBy: {
        id: 'desc', // Ensure the newest results are always on top
      },
    });

    const templateIds = data.map((item) => item.templateId);
    const templates = await prismadb.interviewTemplate.findMany({
      where: {
        id: { in: templateIds },
      },
      select: {
        id: true,
        title: true,
      },
    });

    const templateMap = templates.reduce(
      (acc, template) => {
        acc[template.id] = template.title;
        return acc;
      },
      {} as Record<string, string>,
    );

    const result = data.map((item) => ({
      ...item,
      candidatesCount: item.candidates.length,
      templateName: templateMap[item.templateId],
    }));

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}
