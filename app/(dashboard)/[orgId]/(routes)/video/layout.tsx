import { SectionWrap } from '@/components/share';
import React, { FC, PropsWithChildren } from 'react';

const InterviewLayout: FC<PropsWithChildren> = ({ children }) => {
  return <SectionWrap isScroll>{children}</SectionWrap>;
};

export default InterviewLayout;
