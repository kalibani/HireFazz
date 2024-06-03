'use client';
import { create } from 'zustand';

export interface questionState {
  id?: string;
  videoUrl?: Blob | null | string;
  question: string;
  timeRead?: number;
  timeAnswered?: number;
  title: string;
  idx?: number;
}
interface RecorderState {
  title: string;
  durationTimeRead: number;
  durationTimeAnswered: number;
  questionRetake?: number;
  introVideoUrl?: Blob | null | string;
  farewellVideoUrl?: Blob | null;
  questionVideoUrl?: Blob | null | string;
  farewellTitle?: string;
  farewellDescription?: string;
  questions: questionState[];
  isAddQuestion: boolean;
  questionForm: questionState | null;

  setVideoUrl: (url: Blob | null | string, type: 'intro' | 'question') => void;
  setQuestion: (data: questionState, id?: string) => void;
  setQuestionFromDb: (data: questionState[]) => void;
  removeQuestion: (index: number) => void;
  setIsAddQuestion: (data: boolean) => void;
  setQuestionForm: (data?: questionState) => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  title: '',
  durationTimeRead: 0,
  durationTimeAnswered: 0,
  questionRetake: 0,
  introVideoUrl: null,
  farewellVideoUrl: null,
  questionVideoUrl: null,
  farewellDescription: '',
  farewellTitle: '',
  questions: [],
  isAddQuestion: false,
  questionForm: null,

  setVideoUrl: (url, type) => {
    if (type === 'intro') {
      set({ introVideoUrl: url });
    } else {
      set({ questionVideoUrl: url });
    }
  },

  setQuestion: (data) => {
    if (data.id) {
      set((state) => {
        let newData: questionState[] = state.questions;
        const existingIndex = newData.findIndex((item) => item.id === data.id);
        if (existingIndex !== -1) {
          newData[existingIndex] = { ...data };
        } else {
          newData.push(data);
        }
        return {
          questionForm: null,
          questions: newData,
        };
      });
    } else {
      set((state) => ({ questions: [...state.questions, data] }));
    }
  },

  setQuestionForm: (data) => set({ questionForm: data || null }),

  setQuestionFromDb: (data) => set(() => ({ questions: data })),

  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  setIsAddQuestion: (data) => set({ isAddQuestion: data }),
}));
