import { create } from 'zustand';

interface RecorderState {
  recordedFile: File | null;
  listResult: {
    file: File | null;
    question: string;
  }[];
  setRecordedFile: (file: File) => void;
  texts: string[];
  addText: (text: string) => void;
  updateText: (index: number, value: string) => void;
  removeText: (index: number) => void;
  setListResult: (data: { file: File; question: string }) => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  recordedFile: null,
  setRecordedFile: (file: File) => set({ recordedFile: file }),
  texts: [
    'siapakah kamu ?',
    'Berani sekali kamu apply disni, ini unicorn harus jago kamu kayak ayam',
    'ciyee cari kerja ya..?',
  ],
  listResult: [],
  addText: (text) => set((state) => ({ texts: [text, ...state.texts] })),
  updateText: (index, value) =>
    set((state) => {
      const texts = [...state.texts];
      texts[index] = value;
      return { texts };
    }),
  removeText: (index) =>
    set((state) => ({
      texts: state.texts.filter((_, i) => i !== index),
    })),
  setListResult: (data) =>
    set((state) => ({ listResult: [...state.listResult, data] })),
}));
