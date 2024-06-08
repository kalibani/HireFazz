import { HeaderNavigation } from '@/components/share';
import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = ({ params, searchParams }) => {
  return (
    <div>
      <HeaderNavigation
        urlPath={`/${params.ordID}/video/${params.id}/evaluate`}
        isLabel
        tagLine="There is automatic has been Answered."
        title="Detail Interview"
      />
      page {params.id}
    </div>
  );
};

export default page;
