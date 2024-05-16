import { Banner, SectionWrap } from '@/components/share';
import React, { FC, PropsWithChildren } from 'react';
import dashboard from '@/public/icon/icon-banner-dashboard.svg';

const InterviewLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SectionWrap isScroll>
      <Banner
        title="Automatic Interview"
        desc="Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s, when an unknown printer took a galley of  type and scrambled it to make a type specimen book."
        btnTitle="Check it out !"
        src={dashboard}
        isButton={false}
      />
      {children}
    </SectionWrap>
  );
};

export default InterviewLayout;
