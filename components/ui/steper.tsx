import { FC, Fragment, ReactElement } from 'react';

type TStepper = {
  step: string;
  items: Array<string>;
};

export const Stepper: FC<TStepper> = (props): ReactElement => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative flex w-[400px] items-center justify-center">
        <div className="absolute top-3 h-1.5 w-[290px] rounded-lg bg-gray-300" />
        <div className="absolute flex w-full items-center justify-between">
          {props.items.map((item, key) => (
            <div
              className="flex w-full flex-col items-center gap-y-2"
              key={key}
            >
              <span className="text-sm font-medium">{item}</span>
              <div className="h-6 w-6 rounded-full bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
