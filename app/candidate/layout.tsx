import { FC, PropsWithChildren, ReactElement } from 'react';
import { orgList } from '@/lib/actions/user/orgList';

const CandidateLayout: FC<PropsWithChildren> = async ({
  children,
}): Promise<ReactElement> => {
  return (
    <div className="flex h-screen items-center justify-center">
      <main className="mx-auto">{children}</main>
    </div>
  );
};

export default CandidateLayout;
