import { formSchemaCreateJob } from '@/lib/validators/createJob';
import { z } from 'zod';
import { create } from 'zustand';

interface FormStepState {
  step: number;
  dataCreateJob: z.infer<typeof formSchemaCreateJob>;
  dataDetailJob: string;
  setStep: (step: number) => void;
  setFormCreateJob: (data: z.infer<typeof formSchemaCreateJob>) => void;
  setFormDetailJob: (data: string) => void;
}

const useFormStepStore = create<FormStepState>((set) => ({
  step: 1,
  dataCreateJob: {
    title: '',
    companyName: '',
    workModel: 'remote',
    currency: 'IDR',
    experiences: '0',
    fromNominal: '',
    toNominal: '',
    location: '',
  },
  dataDetailJob: '',
  setStep: (step) => set({ step }),
  setFormCreateJob: (data) => set({ dataCreateJob: data }),
  setFormDetailJob: (data) => set({ dataDetailJob: data }),
}));

export default useFormStepStore;
