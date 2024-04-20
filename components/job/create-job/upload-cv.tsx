'use client';
import { Button } from '@/components/ui/button';
import React, { ChangeEvent, useRef, useState } from 'react';
import { MonitorUp, FileStack, FileSearch, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TableTempCV from './Table-tempCV';

const UploadCv = () => {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDropzone = () => {
    console.log('drop');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    let totalFileSize = 0;
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];

    selectedFiles.forEach((file) => {
      totalFileSize += file.size;
    });

    if (totalFileSize > 100 * 1024 * 1024) {
      alert('Total file size exceeds 100MB limit');
      return;
    }

    setFiles((prevFiles) => [
      ...prevFiles,
      ...selectedFiles.map((file) => ({ id: uuidv4(), file })),
    ]);

    setTotalSize(totalFileSize); // Update totalSize to totalFileSize
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    // Code to submit files
  };

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
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
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
      <div className="flex w-full flex-col items-center rounded-md bg-white">
        <TableTempCV data={files} />
      </div>
      <div className="flex w-full justify-between rounded-md bg-white px-4 py-5">
        <Button variant="outline" className="min-w-32">
          Previous
        </Button>
        <Button className="min-w-32">Next</Button>
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
