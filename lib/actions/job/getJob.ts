import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';

export const getJobList = async () => {
  try {
    const lisfOfJob = await prismadb.batchJob.findMany();
    return lisfOfJob;
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
