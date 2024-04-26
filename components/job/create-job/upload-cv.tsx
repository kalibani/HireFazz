'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { MonitorUp, FileStack, } from 'lucide-react';
import ModalBankCv from './modal-upload-cv';
import { usePopupModal, MODAL_ENUM } from '@/hooks/use-popup-modal';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TableCV from './table';

import { useFormStepStore } from '@/zustand/useCreateJob';
import { UploadCVData } from './table/upload-cv';
import { columns as UploadCVColumns } from './table/upload-cv';

const UploadCv = () => {
  const {
    files,
    handleFileChange,
    handleUploadButtonClick,
    dataCreateJob,
    dataDetailJob,
    setStep,
  } = useFormStepStore((state) => state);
  const { setIsModalOpen } = usePopupModal()

  const uploadDropzone = () => {
    console.log('drop');
  };

  const handleNext = () => {
    setStep(3);
  };

  console.log(files);

  return (
    <>
      <div className="flex w-full flex-col items-center rounded-md bg-white  py-8">
        <h3 className="text-center text-2xl font-semibold">
          Create Job Details
        </h3>
        <p className="text-sm font-normal">
          Please add CV Candidates to add your job list.
        </p>
        <div className="mt-11 flex items-center justify-center gap-x-5">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={(e) => handleFileChange(e, 'From Device')}
            style={{ display: 'none' }}
            id="fileInput"
          />

          <Button
            className="text-sm font-normal"
            onClick={handleUploadButtonClick}
          >
            <MonitorUp className="mr-2 size-4" />
            From Device
          </Button>
          <Button className="text-sm font-normal" onClick={() => setIsModalOpen(MODAL_ENUM.BANK_CV, true)}>
            <FileStack className="mr-2 size-4" /> From Bank CV (Candidates)
          </Button>
          <Select>
            <SelectTrigger className="w-[180px] text-sm font-normal">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dataSelectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="text-sm font-normal" onClick={() => setIsModalOpen(MODAL_ENUM.THIRD_PARTY_CV, true)}>Import</Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center rounded-md bg-white px-1 py-6">
        <TableCV<UploadCVData> data={files} columns={UploadCVColumns} />
      </div>
      <div className="flex w-full justify-between rounded-md bg-white px-4 py-5">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="min-w-32"
        >
          Previous
        </Button>
        <Button
          className="min-w-32"
          onClick={handleNext}
          disabled={files.length <= 0}
        >
          Next
        </Button>
      </div>

      <ModalBankCv />
    </>
  );
};

export default UploadCv;
const dataSelectItems = [
  { value: 'jobStreet', label: 'Job Street' },
  { value: 'techInAsia', label: 'Tech in Asia' },
  { value: 'linkedin', label: 'Linkedin' },
  { value: 'kalibr', label: 'Kalibr' },
];
