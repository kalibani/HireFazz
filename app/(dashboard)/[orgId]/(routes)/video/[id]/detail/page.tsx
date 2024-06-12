import { InterviewAnswer } from '@/components/interview/detail';
import { HeaderNavigation } from '@/components/share';
import getReviewCandidate from '@/lib/actions/interview/score/getReviewCandidate';
import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = async ({ params, searchParams }) => {
  const invitedUserId = searchParams.candidateId;

  const interviewCandidateId = params.id;
  const orgId = params.orgId;
  const candidate = await getReviewCandidate(
    invitedUserId,
    interviewCandidateId,
  );

  return (
    <>
      <HeaderNavigation
        urlPath={`/${orgId}/video/${interviewCandidateId}/completed`}
        isLabel
        tagLine="There is interview has been Answered."
        title="Detail Interview"
      />
      <InterviewAnswer
        candidate={candidate}
        orgId={orgId}
        invitedUserId={invitedUserId}
        interviewCandidateId={interviewCandidateId}
      />
    </>
  );
};

export default page;
