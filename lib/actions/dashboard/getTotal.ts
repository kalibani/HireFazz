'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export default async function getTotals(orgId: string) {
  try {
    const totalCandidates = await prismadb.invitedUser.count({
      where: {
        organizationId: orgId,
      },
    });
    const totalJobs = await prismadb.batchJob.count({
      where: {
        orgId,
      },
    });
    const totalAnalyzed = await prismadb.cvAnalysis.count({
      where: {
        orgId,
        status: 'ANALYSYS',
      },
    });
    const latesJobs = await prismadb.batchJob.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        orgId: true,
        jobName: true,
        createdAt: true,
        status: true,
        interviewCandidates: true,
        cvAnalysis: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 2,
    });
    if (!totalCandidates || !totalJobs || !totalAnalyzed || !latesJobs) {
      return { error: 'Something went wrong' };
    }
    return { totalCandidates, totalJobs, totalAnalyzed, latesJobs };
  } catch (error) {
    errorHandler(error);
  }
}
