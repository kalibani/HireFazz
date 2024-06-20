import ActionButton from '@/components/interview/evaluation-summary/action-button';
import EvaluationCandidate from '@/components/interview/evaluation-summary/evaluation-candidate';
import { HeaderNavigation } from '@/components/share';
import getReviewCandidate from '@/lib/actions/interview/score/getReviewCandidate';
import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = async ({ params, searchParams }) => {
  const orgId = params.orgId || '';
  const interviewCandidateId = params.id || '';
  const invitedUserId = searchParams.candidateId || '';
  const candidate = await getReviewCandidate(
    invitedUserId,
    interviewCandidateId,
  );

  return (
    <div className="space-y-3">
      <HeaderNavigation
        urlPath={`/${orgId}/video/${interviewCandidateId}/completed`}
      />
      {candidate && 'candidateName' in candidate && (
        <>
          <div className="flex items-center justify-between rounded-md bg-white p-4">
            <div className="rounded-mdtext-right flex w-fit flex-col">
              <h3 className="text-2xl font-semibold">Analysis Interview</h3>
              <p className="text-sm text-slate-400">
                The following are the results of candidate interviews.
              </p>
            </div>
            <div className="rounded-mdtext-right flex w-fit flex-col text-right">
              <h3 className="text-2xl font-semibold capitalize">
                {candidate?.candidateName || ''}
              </h3>
              <p className="text-sm capitalize text-slate-400">
                {candidate?.templateName || ''}
              </p>
            </div>
          </div>
          <EvaluationCandidate candidate={candidate} as IEvaluationCandidate />
          <div className="flex items-center justify-between rounded-md bg-white p-3">
            <div className="flex flex-col gap-y-1 text-left">
              <h3 className="text-xl font-semibold text-primary">
                {candidate.candidateName}
              </h3>
              <p className="text-xs text-slate-400">
                Email: {candidate?.email}
              </p>
            </div>
            <div className="flex items-center gap-x-7">
              <h4 className="text-lg font-semibold text-primary">
                What would you like to do for this candidate?
              </h4>
              <ActionButton id={invitedUserId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
