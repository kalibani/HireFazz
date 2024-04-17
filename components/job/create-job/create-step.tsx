'use client';

import React from 'react';
import TrackingStep from './tracking-step';
import CreateJobDetail from './create-job-detail';
import useFormStepStore from '@/zustand/useCreateJob';
import FormCreate from './form-create';

const CreateStep = () => {
  const step = useFormStepStore((state) => state.step);
  return (
    <div className="space-y-3">
      <TrackingStep step={step} />
      <div className="flex min-h-svh w-full flex-col items-center rounded-md bg-white  py-8">
        {step === 0 && <FormCreate />}
        {step === 1 && <CreateJobDetail />}
        {/* on progress */}
        {step === 2 && <div>Upload cv</div>}
      </div>
    </div>
  );
};

export default CreateStep;
