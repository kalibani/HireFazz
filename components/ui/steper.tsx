import { FC, ReactElement } from 'react';

type TStepper = {
  step: string;
};

export const Stepper: FC<TStepper> = (props): ReactElement => {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="h-2 w-2/4 rounded-lg bg-gray-300" />
      <div className="absolute left-[16rem] h-5 w-5 rounded-full bg-gray-300" />
      <div className="absolute h-5 w-5 rounded-full bg-gray-300" />
      <div className="absolute right-[16rem] h-5 w-5 rounded-full bg-gray-300" />
    </div>
  );
};
