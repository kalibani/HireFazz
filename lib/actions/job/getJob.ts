import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export const getJobList = async (orgId: string, take: number, skip: number) => {
  try {
    const listOfJob = await prismadb.batchJob.findMany({
      where: {
        orgId,
      },
      take,
      skip,

      include: {
        cvAnalysis: {
          where: {
            status: 'SHORTLISTED',
          },
          select: {
            status: true,
          },
        },
      },
    });
    const jobListWithShortlisted: any[] = listOfJob.map((job) => ({
      ...job,
      candidates: job.cvAnalysis.length,
      shortlisted: job.cvAnalysis.length,
    }));

    return jobListWithShortlisted;
  } catch (error) {
    return errorHandler(error);
  }
};

export const getByIdJob = async (id: string) => {
  try {
    const jobDetail = await prismadb.batchJob.findUnique({ where: { id } });
    return jobDetail;
  } catch (error) {
    return errorHandler(error);
  }
};
