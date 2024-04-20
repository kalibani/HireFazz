'use client';
import { FC, ReactElement } from 'react';
import { JobDetailModule } from './job-detail';
import { UploadCvModule } from './upload-cv';
import { JobDescriptionModule } from './job-description';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { match } from 'ts-pattern';
import { Stepper } from '@/components/ui/steper';

export const CreateJobModule: FC = (): ReactElement => {
  const [step] = useQueryState('step', parseAsString.withDefault('job-detail'));

  const JobModule = match(step)
    .with('job-detail', () => <JobDetailModule />)
    .with('upload-cv', () => <UploadCvModule />)
    .with('job-description', () => <JobDescriptionModule />)
    .otherwise(() => <JobDetailModule />);

  return (
    <div className="flex w-full flex-col gap-y-8">
      <Stepper step={step} />
      <section className="flex w-full items-center justify-center">
        {JobModule}
      </section>
    </div>
  );
};
