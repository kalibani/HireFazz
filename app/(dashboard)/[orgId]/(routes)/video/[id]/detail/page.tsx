import { InterviewAnswer } from '@/components/interview/detail';
import { HeaderNavigation } from '@/components/share';
import getReviewCandidate from '@/lib/actions/interview/score/getReviewCandidate';
import { type TResponseDetailInterview } from '@/lib/validators/interview';
import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = async ({ params, searchParams }) => {
  const invitedUserId = searchParams.candidateId;
  const questionsIndex = searchParams.question || '';
  const interviewCandidateId = params.id;
  const orgId = params.orgId;
  const candidate = (await getReviewCandidate(
    invitedUserId,
    interviewCandidateId,
  )) as TResponseDetailInterview;
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
        questionIndex={Number(questionsIndex)}
        orgId={orgId}
        invitedUserId={invitedUserId}
        interviewCandidateId={interviewCandidateId}
      />
    </>
  );
};

export default page;
