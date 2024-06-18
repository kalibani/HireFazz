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

import { FormStepState, useFormStepStore } from '@/zustand/useCreateJob';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateDMY, formatFileSize } from '@/helpers';
import { FC, ReactElement, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { truncateString } from '@/lib/utils';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';

const UploadCv: FC = (): ReactElement => {
  const {
    files,
    handleFileChange,
    handleDeleteFile,
    handleUploadButtonClick,
    setStep,
  } = useFormStepStore((state) => state);
  const t = useTranslations('CreateJob')
  const { setIsModalOpen } = usePopupModal();
  const [tableItems, setTableItems] = useState<FormStepState['files']>([]);
  const searchParams = useSearchParams();
  const perPage = searchParams.get('per_page') || '10';
  const currPage = searchParams.get('page') || '1';
  const query = searchParams.get('search');

  const handleNext = () => {
    setStep(3);
  };

  interface UploadCVData {
    file: File;
  }
  // handle filter & pagination in client side, since cv upload is in client state
  useEffect(() => {
    const allItems = files;
    let itemInPage: FormStepState['files'] = allItems;
    if (query) {
      const namePattern = new RegExp(query);
      itemInPage = allItems.filter((item) => namePattern.test(item.file.name));
    }
    if (allItems.length) {
      const firstItem = (Number(currPage) - 1) * Number(perPage);
      const lastItem = Number(currPage) * Number(perPage);
      itemInPage = itemInPage.slice(firstItem, lastItem);
    }

    setTableItems(itemInPage);
  }, [files, perPage, currPage, query]);

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
            {t('columnName')}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.file.name;
        const truncated = truncateString(value, 30);

        return (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p>{truncated}</p>
              </TooltipTrigger>
              <TooltipContent
                className="rounded-md bg-gray-900 p-2 text-slate-300"
                hidden={value.length <= 30}
              >
                {value}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
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
            {t('columnCreatedAt')}
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
            {t('columnSize')}
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
            {t('columnSource')}
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
        <div className="flex items-center justify-center gap-x-5">
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
            {t('fromDevice')}
          </Button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    className="text-sm font-normal"
                    onClick={() => setIsModalOpen(MODAL_ENUM.BANK_CV, true)}
                    // temporary disabled, while focus on upload from device
                    disabled
                  >
                    <FileStack className="mr-2 size-4" /> {t('fromBankCV')}
                  </Button>
                </div>
              </TooltipTrigger>

              <TooltipContent
                className="rounded-md bg-gray-900 px-2 py-1 text-slate-300 shadow-md"
                sideOffset={5}
              >
                Coming Soon
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-x-5">
                  <Select
                    // temporary disabled, while focus on upload from device
                    disabled
                  >
                    <SelectTrigger className="w-[180px] text-sm font-normal">
                      <SelectValue placeholder={t('selectPlatform')} />
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
                    onClick={() =>
                      setIsModalOpen(MODAL_ENUM.THIRD_PARTY_CV, true)
                    }
                    // temporary disabled, while focus on upload from device
                    disabled
                  >
                    {t('import')}
                  </Button>
                </div>
              </TooltipTrigger>

              <TooltipContent
                className="rounded-md bg-gray-900 px-2 py-1 text-slate-300 shadow-md"
                sideOffset={5}
              >
                Coming Soon
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className={`flex ${tableItems.length < 3 ? 'flex-1 h-full' : 'h-fit'} w-full flex-col items-center rounded-md bg-white px-1 py-6`}>
        <TableCV<UploadCVData>
          data={tableItems}
          columns={columns}
          totalItems={files.length}
          dataFrom="Device"
        />
      </div>
      <div className="flex w-full justify-between rounded-md bg-white px-4 py-5">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="min-w-32"
        >
          {t('cta_prev')}
        </Button>
        <Button
          className="min-w-32"
          onClick={handleNext}
        >
          {t('cta_next')}
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
