import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = ({ params }) => {
  return (
    <div>
      {params.id} <p>Detail page invite candidates</p>
    </div>
  );
};

export default page;
