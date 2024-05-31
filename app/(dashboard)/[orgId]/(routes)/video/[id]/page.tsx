import { ParamsProps } from '@/types/types';
import React, { FC } from 'react';

const page: FC<ParamsProps> = ({ params }) => {
  return (
    <div>
      {params.id} <p>apaan dah</p>
    </div>
  );
};

export default page;
