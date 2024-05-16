import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { ANALYSYS_STATUS, BatchJob, Cv, CvAnalysis } from '@prisma/client';

interface PaginationInfo {
  totalItems: number;
  totalPage: number;
}
export interface GetJobListData extends PaginationInfo {
  data: BatchJob[];
}

export const getJobList = async (
  orgId: string,
  take: number,
  skip: number,
  query?: Record<string, string>,
) => {
  try {
    const jobNameQuery = query?.jobName || '';
    const locationQuery = query?.location || '';

    // all items in filter: orgId, name, location
    const totalCount = await prismadb.batchJob.count({
      where: {
        orgId,
        AND: {
          jobName: {
            contains: jobNameQuery,
          },
          location: {
            contains: locationQuery,
          },
        },
      },
    });
    const listOfJob = await prismadb.batchJob.findMany({
      where: {
        orgId,
        AND: {
          jobName: {
            contains: jobNameQuery,
          },
          location: {
            contains: locationQuery,
          },
        },
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

    const result = {
      totalItems: totalCount,
      totalPage: Math.ceil(totalCount / take),
      data: jobListWithShortlisted,
    };

    return result;
  } catch (error) {
    return errorHandler(error);
  }
};

export type TCV = {
  id: string;
  cvId: string;
  orgId: string;
  batchJobId: string;
  location: string;
  reportOfAnalysis: {
    matchedPercentage: number;
  };
  status: ANALYSYS_STATUS;
  isQualified: boolean;
  cv: Cv;
};

// change Name into Job Detail Response
export interface Job {
  id: string;
  jobName: string;
  status: string; // replace to enum later
  orgId: string;
  jobDescription: string;
  location: string;
  createdAt: string;
  salaryCurrency?: string;
  salaryRangeFrom?: number;
  salaryRangeEnd?: number;
  experience?: number;
  companyName?: string;
  workModel?: 'ONSITE' | 'REMOTE' | 'HYBRID';
  reportOfAnalysis: {
    matchPercentage: number;
  };
  cvAnalysis: TCV[];
}

export interface GetJobDetailResponse {
  cvAnalysisPagination: PaginationInfo;
  data?: Job;
}

export const getByIdJob = async (id: string, take?: number, skip?: number) => {
  try {
    const jobDetail = await prismadb.batchJob.findUnique({
      where: { id },
      include: {
        cvAnalysis: {
          include: {
            cv: true,
          },
          take,
          skip,
        },
      },
    });

    const totalCount = jobDetail?.cvAnalysis.length || 0;
    const result = {
      cvAnalysisPagination: {
        totalItems: totalCount,
        totalPage: take ? Math.ceil(totalCount / take) : 1,
      },
      data: jobDetail,
    };
    return result;
  } catch (error) {
    return errorHandler(error);
  }
};

export const getByIdJobShortlisted = async (
  id: string,
  take?: number,
  skip?: number,
) => {
  try {
    const jobDetail = await prismadb.batchJob.findUnique({
      where: { id },
      include: {
        cvAnalysis: {
          include: {
            cv: true,
          },
          take,
          skip,
        },
      },
    });

    const totalCount = jobDetail?.cvAnalysis.length || 0;
    const result = {
      cvAnalysisPagination: {
        totalItems: totalCount,
        totalPage: take ? Math.ceil(totalCount / take) : 1,
      },
      data: jobDetail,
    };
    return result;
  } catch (error) {
    return errorHandler(error);
  }
};
