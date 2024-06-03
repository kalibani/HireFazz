import { FC, PropsWithChildren, ReactElement } from 'react';
import { orgList } from '@/lib/actions/user/orgList';

const CandidateLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  const org = await orgList();
  return (
    <div className="flex h-full items-center justify-center bg-[#F2F2F7]">
      <main>{children}</main>
    </div>
  );
};

export default CandidateLayout;
