'use client';

import React, { useEffect } from 'react';
import TrackingStep from './tracking-step';
import CreateJobDetail from './create-job-detail';
import { useFormStepStore } from '@/zustand/useCreateJob';
import FormCreate from './form-create';
import UploadCv from './upload-cv';
import { useStore } from 'zustand';
import CVAnalyzer from './cv-analyzer';

const CreateStep = () => {
  const { step, resetFormCreateJob, resetFormDetailJob, setFiles, setStep } = useStore(useFormStepStore, (state) => state);

  useEffect(() => {
    
    return () => {
      resetFormCreateJob()
      resetFormDetailJob()
      setFiles([])
      setStep(0)
    }
  }, [])

  return (
    <div className="flex h-full flex-col space-y-3">
      <TrackingStep step={step} />
      {step === 0 && <FormCreate />}
      {step === 1 && <CreateJobDetail />}
      {step === 2 && <UploadCv />}
      {step === 3 && <CVAnalyzer isUpdate={false} />}
    </div>
  );
};

export default CreateStep;
