import { DetailHeaderJob } from '@/components/job/detail/header-job';
import { FC, PropsWithChildren, ReactElement } from 'react';

const JobDetailTemplate: FC<PropsWithChildren> = (props): ReactElement => {
  return (
    <main className="w-full px-3">
      <DetailHeaderJob title="Senior Software Engineer" />
      {props.children}
    </main>
  );
};

export default JobDetailTemplate;
