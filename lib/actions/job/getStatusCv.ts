'use server';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { $Enums } from '@prisma/client';

type TReturnType = {
  isUploading: boolean;
  isAnalyze: boolean;
  statusCv: $Enums.ANALYSYS_STATUS;
  source: $Enums.CV_SOURCE;
  docName: string;
}[];

export async function getStatusCv(jobId: string): Promise<TReturnType> {
  try {
    const job = await prismadb.batchJob.findUniqueOrThrow({
      where: {
        id: jobId,
      },
      select: {
        cvAnalysis: {
          select: {
            status: true,
            cv: {
              select: {
                uploadStatus: true,
                source: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const formatedResponse = job.cvAnalysis.map((el) => {
      return {
        isUploading:
          el.cv.uploadStatus === 'PENDING' ||
          el.cv.uploadStatus === 'PROCESSING',
        isAnalyze: el.status === 'ON_ANALYSYS',
        statusCv: el.status,
        source: el.cv.source,
        docName: el.cv.name,
      };
    });
    return formatedResponse;
  } catch (error) {
    throw errorHandler(error);
  }
}
