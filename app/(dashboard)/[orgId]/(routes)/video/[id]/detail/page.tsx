import { InterviewAnswer } from '@/components/interview/detail';
import { HeaderNavigation } from '@/components/share';
import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = ({ params, searchParams }) => {
  return (
    <>
      <HeaderNavigation
        urlPath={`/${params.ordID}/video/${params.id}/evaluate`}
        isLabel
        tagLine="There is interview has been Answered."
        title="Detail Interview"
      />
      <InterviewAnswer />
    </>
  );
};

export default page;
