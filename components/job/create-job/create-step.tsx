'use client';

import React from 'react';
import TrackingStep from './tracking-step';
import CreateJobDetail from './create-job-detail';
import { useFormStepStore } from '@/zustand/useCreateJob';
import FormCreate from './form-create';
import UploadCv from './upload-cv';
import { useStore } from 'zustand';
import CVAnalyzer from './cv-analyzer';

const CreateStep = () => {
  const step = useStore(useFormStepStore, (state) => state.step);
  return (
    <div className="space-y-3 flex flex-col h-full">
      <TrackingStep step={step} />
      {step === 0 && <FormCreate />}
      {step === 1 && <CreateJobDetail />}
      {step === 2 && <UploadCv />}
      {step === 3 && <CVAnalyzer />}
    </div>
  );
};

export default CreateStep;
