import { NextRequest, NextResponse } from 'next/server';

import { safeParseJSON } from '@/lib/utils';
import { currentUser } from '@/lib/auth';
import { PayloadAddJob, connectCvJob } from '@/lib/actions/job/createJob';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { uploadCv } from '@/lib/actions/cv/uploadCv';

export const preferredRegion = 'sin1';
export const maxDuration = 50;
// export const runtime = "edge";

interface OnSuccessProps { 
  id: string;
  url: string;
  key: string
}

export const POST = async (req: NextRequest) => {
  try {
    // endpoint for get the result of cv analyzer
    const body = await req.formData();
    const user = await currentUser();

    if (!user?.id) return new NextResponse('Unauthorized', { status: 401 });

    const payload = safeParseJSON<z.infer<typeof PayloadAddJob>>(body.get('createPayload') as string)

    if (!payload) return new NextResponse('Bad Request', { status: 400 });

    const cvData = body.getAll('UPLOAD') as File[];
    // const cvLinkedin = body.getAll('LINKEDIN') as string[];

    const { analyzeCv, ...safePayload } = PayloadAddJob.parse(payload);
    const job = await prismadb.batchJob.create({
      data: {
        ...safePayload,
        matchPercentage: safePayload.matchPercentage
          ? Number(safePayload.matchPercentage)
          : undefined,
      },
    });

    let count = 0
    const onSuccess = (props: { id: string; url: string; key: string }) => {
      connectCvJob({
        cvId: props.id,
        orgId: safePayload.orgId,
        batchJobId: job.id,
        analyzeCvEnabled: analyzeCv,
      });
      count++
      console.log('SUCCESS UPLOAD:', count)
    };

    if (!job) return new NextResponse('Failed creating job', { status: 500 });

    uploadBulk(cvData, payload, onSuccess)

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.log('error api', error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
};


const uploadBulk = async (data: File[], additional: z.infer<typeof PayloadAddJob>, onSuccess: (props: OnSuccessProps) => void) => {
  let count = 1
  for (const file of data) {
    await uploadCv({ cv: file, source: 'UPLOAD', orgId: additional.orgId }, onSuccess)
  }
}