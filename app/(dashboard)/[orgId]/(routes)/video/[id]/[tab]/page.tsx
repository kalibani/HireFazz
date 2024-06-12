import { DetailListContent } from '@/components/interview/detail';

import getAllCandidates from '@/lib/actions/interview/getAllcandidates';
import { TResponseAllCandidates } from '@/lib/validators/interview';
import { ParamsProps } from '@/types/types';
import { INVITED_USER_STATUS } from '@prisma/client';

import React, { FC } from 'react';

const page: FC<ParamsProps> = async ({ params, searchParams }) => {
  const search = searchParams.q || '';
  const interviewId = params.id || '';
  const tab = params.tab.toUpperCase() || '';
  const perPage = Number(searchParams.per_page || '10');
  const page = Number(searchParams.page || '1');
  const candidates = (await getAllCandidates(
    interviewId,
    page,
    perPage,
    tab as INVITED_USER_STATUS,
    search,
  )) as TResponseAllCandidates;

  return (
    <DetailListContent
      candidates={candidates}
      isEvaluate={tab === 'COMPLETED'}
    />
  );
};

export default page;
