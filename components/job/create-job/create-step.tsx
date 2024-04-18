'use client';

import React from 'react';
import TrackingStep from './tracking-step';
import CreateJobDetail from './create-job-detail';
import useFormStepStore from '@/zustand/useCreateJob';
import FormCreate from './form-create';
import UploadCv from './upload-cv';

const CreateStep = () => {
  const step = useFormStepStore((state) => state.step);
  return (
    <div className="space-y-3">
      <TrackingStep step={step} />
      {step === 0 && <FormCreate />}
      {step === 1 && <CreateJobDetail />}
      {/* on progress */}
      {step === 2 && <UploadCv />}
    </div>
  );
};

export default CreateStep;
