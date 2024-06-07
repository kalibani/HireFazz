import { type TResponseAllCandidates } from '@/lib/validators/interview';
import React, { FC } from 'react';
import TableDetail from './table-detail';
import SearchFilter from './search-filter';

const InvitedContent: FC<{ candidates: TResponseAllCandidates }> = ({
  candidates,
}) => {
  return (
    <>
      <SearchFilter />
      <TableDetail title="Invited" dataSource={candidates} />
    </>
  );
};

export default InvitedContent;
