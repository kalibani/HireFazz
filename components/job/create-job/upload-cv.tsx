'use client';
import { Button } from '@/components/ui/button';
import { MonitorUp, FileStack, Trash2, ArrowUpDown } from 'lucide-react';
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
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateDMY, formatFileSize } from '@/helpers';
import { FC, ReactElement } from 'react';

const UploadCv: FC = (): ReactElement => {
  const {
    files,
    handleFileChange,
    handleDeleteFile,
    handleUploadButtonClick,
    setStep,
  } = useFormStepStore((state) => state);
  const { setIsModalOpen } = usePopupModal();

  const handleNext = () => {
    setStep(3);
  };

  interface UploadCVData {
    file: File;
  }

  const columns: ColumnDef<UploadCVData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-slate-400 bg-white text-black"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            File Name
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => <p className="capitalize">{row.original.file.name}</p>,
    },
    {
      accessorKey: 'Added on',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Added On
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">
          {formatDateDMY(row.original.file.lastModified)}
        </p>
      ),
    },
    {
      accessorKey: 'size',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Size
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const size: number = row.original.file.size;
        return (
          <p className="capitalize text-slate-400">{formatFileSize(size)}</p>
        );
      },
    },
    {
      accessorKey: 'from',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            From
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">{row.getValue('from')}</p>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => {
              handleDeleteFile(row.index);
            }}
            variant="ghost"
            className="hover:bg-transparent"
          >
            <Trash2 className="size-4 text-primary" />
          </Button>
        );
      },
    },
  ];

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
          <Button
            className="text-sm font-normal"
            onClick={() => setIsModalOpen(MODAL_ENUM.BANK_CV, true)}
          >
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
          <Button
            className="text-sm font-normal"
            onClick={() => setIsModalOpen(MODAL_ENUM.THIRD_PARTY_CV, true)}
          >
            Import
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center rounded-md bg-white px-1 py-6">
        <TableCV<UploadCVData> data={files} columns={columns} />
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
