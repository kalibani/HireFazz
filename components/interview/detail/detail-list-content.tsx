import { type TResponseAllCandidates } from '@/lib/validators/interview';
import React, { FC } from 'react';
import { TableDetail, SearchFilter } from '@/components/interview/detail';

const DetailListContent: FC<{
  candidates: TResponseAllCandidates;
  isEvaluate?: boolean;
}> = ({ candidates, isEvaluate }) => {
  return (
    <>
      <SearchFilter />
      <TableDetail
        title="Invited"
        dataSource={candidates}
        isEvaluate={isEvaluate}
      />
    </>
  );
};

export default DetailListContent;
