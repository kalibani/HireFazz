'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { MonitorUp, FileStack } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TableTempCV from './Table-tempCV';

import { useFormStepStore } from '@/zustand/useCreateJob';

const UploadCv = () => {
  const { files, handleFileChange, handleUploadButtonClick, setStep } =
    useFormStepStore((state) => state);

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
            <MonitorUp className="mr-2 h-4 w-4" />
            From Device
          </Button>
          <Button className="text-sm font-normal">
            <FileStack className="mr-2 h-4 w-4" /> From Bank CV (Candidates)
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
          <Button className="text-sm font-normal">Import</Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center rounded-md bg-white px-1 py-6">
        <TableTempCV data={files} />
      </div>
      <div className="flex w-full justify-between rounded-md bg-white px-4 py-5">
        <Button variant="outline" className="min-w-32">
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
