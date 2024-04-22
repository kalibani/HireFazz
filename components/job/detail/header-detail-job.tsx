import { Button } from '@/components/ui/button';
import type { FC, ReactElement } from 'react';

type TDetailHeaderJob = {
  title: string;
};

export const HeaderDetailJob: FC<TDetailHeaderJob> = (props): ReactElement => {
  return (
    <header className="flex w-full flex-col rounded-lg bg-white p-6">
      <section className="flex w-full justify-between">
        <h1 className="text-2xl font-medium">{props.title}</h1>
        <Button>+ Upload CV</Button>
      </section>
    </header>
  );
};
