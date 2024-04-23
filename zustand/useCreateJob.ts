import { formSchemaCreateJob } from '@/lib/validators/createJob';
import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { stat } from 'fs';

interface FormStepState {
  step: number;
  dataCreateJob: z.infer<typeof formSchemaCreateJob>;
  dataDetailJob: string;
  totalSize: number;
  files: {
    file: File;
  }[];
  formData: FormData;
  setStep: (step: number) => void;
  setFormCreateJob: (data: z.infer<typeof formSchemaCreateJob>) => void;
  setFormDetailJob: (data: string) => void;
  setTotalSize: (total: number) => void;
  setFiles: (data: any[]) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadButtonClick: () => void;
}

export const useFormStepStore = create<FormStepState>((set) => ({
  step: 2,
  dataCreateJob: {
    // title: '',
    // companyName: '',
    // workModel: 'remote',
    // currency: 'IDR',
    // experiences: '0',
    // fromNominal: '',
    // toNominal: '',
    // location: '',
    title: 'Project Manager',
    location: 'indonesia',
    fromNominal: '',
    toNominal: '',
    experiences: '1',
    workModel: 'REMOTE',
    companyName: 'ABCDE',
    currency: 'IDR',
  },
  dataDetailJob:
    '<p><strong>JobDescription :</strong></p><p>We are currently seeking a dedicated Project Manager to join our team at ABCDE in Indonesia. This remote position is an excellent opportunity for individuals with at least 1 year of experience in project management. As a Project Manager, you will play a crucial role in planning, executing, and finalizing projects according to strict deadlines and within budget. This includes acquiring resources and coordinating the efforts of team members and third-party contractors or consultants in order to deliver projects according to plan. If you are passionate about leading projects to success and are looking for a remote opportunity to showcase your skills, we would love to hear from you.</p><p><br></p><p><strong>Skill :</strong></p><p>Skill set for a Project Manager includes leadership, communication, time management, problem-solving, budgeting, risk management, and team collaboration.</p><p><br></p><p><strong>Responsibilities :</strong></p><p>As a Project Manager, your responsibilities will include overseeing remote projects from inception to completion, ensuring that all projects are delivered on time, within scope, and within budget. You will be responsible for coordinating with team members who are working remotely, ensuring clear communication and effective collaboration. Additionally, you will be tasked with managing any issues or risks associated with the projects, ensuring they are identified and resolved promptly. With at least 1 year of experience, you are expected to apply your knowledge and skills to lead projects successfully while adapting to the challenges of a remote work model.</p><p><br></p><p><strong>Requirement :</strong></p><p>We are looking for a Project Manager based in Indonesia. This position is open for individuals with at least 1 year of experience. The role is fully remote, allowing you to work from anywhere within the country. The successful candidate will join our team at ABCDE. This position offers a competitive salary in IDR.</p>',
  totalSize: 0,
  files: [],
  formData: new FormData(),
  setStep: (step) => set({ step }),
  setFormCreateJob: (data) => set({ dataCreateJob: data }),
  setFormDetailJob: (data) => set({ dataDetailJob: data }),
  setFiles: (data) => set({ files: data }),
  setTotalSize: (totalSize) => set({ totalSize }),
  handleFileChange: (event) => {
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

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('UPLOAD', file);
    });
    set((state) => ({
      files: [...state.files, ...selectedFiles.map((file) => ({ file }))],
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
