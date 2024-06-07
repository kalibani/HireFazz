import { EvaluateContent, InvitedContent } from '@/components/interview/detail';

import getAllCandidates from '@/lib/actions/interview/getAllcandidates';
import { TResponseAllCandidates } from '@/lib/validators/interview';
import { ParamsProps } from '@/types/types';
import { INVITED_USER_STATUS } from '@prisma/client';

import { notFound } from 'next/navigation';
import React, { FC } from 'react';
import { match } from 'ts-pattern';

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
  return match(params.tab as string)
    .with('invited', () => <InvitedContent candidates={candidates} />)
    .with('completed', () => <EvaluateContent candidates={candidates} />)
    .with('shortlisted', () => <InvitedContent candidates={candidates} />)
    .with('rejected', () => <InvitedContent candidates={candidates} />)
    .otherwise(() => notFound());
};

export default page;
