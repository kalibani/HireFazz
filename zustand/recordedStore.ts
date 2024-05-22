import { blobToFormData } from '@/lib/utils';
import { create } from 'zustand';

interface questionState {
  id?: string;
  videoUrl?: Blob | null | string;
  question: string;
  timeRead?: number;
  timeAnswered?: number;
  title: string;
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

  setVideoUrl: (url: Blob | null | string, type: 'intro' | 'question') => void;
  setQuestion: (data: questionState) => void;
  setQuestionFromDb: (data: questionState[]) => void;
  removeQuestion: (index: number) => void;
  setIsAddQuestion: () => void;
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

  setVideoUrl: (url, type) => {
    if (type === 'intro') {
      set({ introVideoUrl: url });
    } else {
      set({ questionVideoUrl: url });
    }
  },

  setQuestion: (data) =>
    set((state) => ({ questions: [...state.questions, data] })),

  setQuestionFromDb: (data) => set(() => ({ questions: data })),

  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  setIsAddQuestion: () =>
    set((state) => ({ isAddQuestion: !state.isAddQuestion })),
}));
