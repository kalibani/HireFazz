import { TResponseAllCandidates } from '@/lib/validators/interview';
import React, { FC } from 'react';
import SearchFilter from './search-filter';
import TableDetail from './table-detail';

const EvaluateContent: FC<{ candidates: TResponseAllCandidates }> = ({
  candidates,
}) => {
  return (
    <>
      <SearchFilter />
      <TableDetail title="Invited" dataSource={candidates} isEvaluate />
    </>
  );
};

export default EvaluateContent;
