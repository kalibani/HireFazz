import CreateStep from '@/components/job/create-job/create-step';
import { SectionWrap } from '@/components/share';
import { NextPage } from 'next';
import React, { ReactElement } from 'react';

const CreateNewJob: NextPage = (): ReactElement => {
  return (
    <SectionWrap>
      <CreateStep />
    </SectionWrap>
  );
};

export default CreateNewJob;

