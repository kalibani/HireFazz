import { FC, PropsWithChildren, ReactElement } from 'react';

const CreateJobTemplate: FC<PropsWithChildren> = ({
  children,
}): ReactElement => {
  return (
    <div className="flex h-auto w-full items-center justify-center px-8">
      {children}
    </div>
  );
};

export default CreateJobTemplate;
