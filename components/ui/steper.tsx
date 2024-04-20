import { FC, ReactElement } from 'react';

type TStepper = {
  step: string;
};

export const Stepper: FC<TStepper> = (props): ReactElement => {
  return (
    <div className="flex w-full items-center">
      <div className="h-0.5 w-full rounded-lg bg-gray-300"></div>
    </div>
  );
};
