import { FormSchemaCreateJob } from '@/lib/validators/createJob';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { create } from 'zustand';

export interface FormStepState {
  step: number;
  dataCreateJob: z.infer<FormSchemaCreateJob>;
  dataDetailJob: string;
  totalSize: number;
  files: {
    file: File;
    from: string;
  }[];
  formData: FormData;
  setStep: (step: number) => void;
  setFormCreateJob: (data: z.infer<FormSchemaCreateJob>) => void;
  setFormDetailJob: (data: string) => void;
  setTotalSize: (total: number) => void;
  resetFormCreateJob: () => void;
  resetFormDetailJob: () => void;
  setFiles: (data: any[]) => void;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    from: string,
  ) => void;
  handleDeleteFile: (index: number) => void;
  handleUploadButtonClick: () => void;
}

const defaultDataCreateJob: z.infer<FormSchemaCreateJob> = {
  title: '',
  companyName: '',
  workModel: 'REMOTE',
  currency: 'IDR',
  experiences: '0',
  fromNominal: '',
  toNominal: '',
  location: '',
};

export const useFormStepStore = create<FormStepState>((set) => ({
  step: 0,
  dataCreateJob: defaultDataCreateJob,
  dataDetailJob: '',
  totalSize: 0,
  files: [],
  formData: new FormData(),
  setStep: (step) => set({ step }),
  setFormCreateJob: (data) => set({ dataCreateJob: data }),
  setFormDetailJob: (data) => set({ dataDetailJob: data }),
  setFiles: (data) => set({ files: data }),
  setTotalSize: (totalSize) => set({ totalSize }),
  handleDeleteFile: (index: number) => {
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    }));
  },
  resetFormCreateJob: () => set({ dataCreateJob: { ...defaultDataCreateJob } }),
  resetFormDetailJob: () => set({ dataDetailJob: '' }),
  handleFileChange: (event, from: string) => {
    let totalFileSize = 0;
    const selectedFiles = event.target.files
      ? Array.from(event.target.files).filter((file) => {
          if (file.size >= 4 * 1024 * 1024) {
            toast.error(`${file.name} File size must be less than 4MB.`);
            return false;
          }
          return true;
        })
      : [];

    selectedFiles.forEach((file) => {
      totalFileSize += file.size;
    });

    if (totalFileSize > 100 * 1024 * 1024) {
      alert('Total file size exceeds 100MB limit');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('UPLOAD', file);
      formData.append('from', from);
    });
    set((state) => ({
      files: [...state.files, ...selectedFiles.map((file) => ({ file, from }))],
      totalSize: totalFileSize,
      formData: formData,
    }));
  },

  handleUploadButtonClick: () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  },
}));
