'use client';

import React, { FC, useEffect } from 'react';
import { useStore } from 'zustand';
import CVAnalyzer from '../create-job/cv-analyzer';
import UploadCv from '../create-job/upload-cv';
import { useFormStepStore } from '@/zustand/useCreateJob';
import { TDetailJobTableProps } from '@/lib/actions/job/getJob';
import { useParams } from 'next/navigation';

type TWorkModel =
  | 'HYBRID'
  | 'ONSITE'
  | 'REMOTE'
  | 'FREELANCE'
  | 'INTERNSHIP'
  | 'PART_TIME'
  | 'CONTRACT';

const DetailUploadCVStep: FC<TDetailJobTableProps> = ({ jobDetail }) => {
  const { id } = useParams();

  const { step, setStep, setFormCreateJob } = useStore(
    useFormStepStore,
    (state) => state,
  );

  useEffect(() => {
    setStep(2);
    setFormCreateJob({
      title: jobDetail?.data?.jobName as string,
      location: jobDetail?.data?.location as string,
      currency: jobDetail?.data?.salaryCurrency as string,
      experiences: jobDetail?.data?.experience?.toString() as string,
      companyName: jobDetail?.data?.companyName as string,
      workModel: jobDetail?.data?.workModel as TWorkModel,
    });
  }, [id]);

  return (
    <div className="flex h-full flex-col space-y-3">
      {step === 2 && <UploadCv />}
      {step === 3 && <CVAnalyzer isUpdate />}
    </div>
  );
};
export default DetailUploadCVStep;
