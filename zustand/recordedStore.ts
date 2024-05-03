import { blobToFormData } from '@/lib/utils';
import { url } from 'inspector';
import { create } from 'zustand';

interface questionState {
  videoUrl?: File | null;
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
  introVideoUrl?: FormData | null;
  farewellVideoUrl?: FormData | null;
  farewellTitle?: string;
  farewellDescription?: string;
  questions: questionState[];
  setTitle: (title: string, type: 'title' | 'farewell' | 'desc') => void;
  setFormFirst: (data: {
    title: string;
    durationTimeRead?: number;
    durationTimeAnswered?: number;
    questionRetake?: number;
  }) => void;
  setVideoUrl: (url: FormData | null, type: 'intro' | 'farewell') => void;
  setQuestion: (data: questionState[]) => void;
  removeQuestion: (index: number) => void;
  addQuestion: () => void;
  urlAny: any;
  setFormData: (data: any) => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  title: '',
  durationTimeRead: 0,
  durationTimeAnswered: 0,
  questionRetake: 0,
  introVideoUrl: null,
  farewellVideoUrl: null,
  farewellDescription: '',
  farewellTitle: '',
  questions: [
    {
      videoUrl: null,
      title: '',
      question: '',
      timeRead: 0,
      timeAnswered: 0,
    },
  ],
  urlAny: new FormData(),

  setTitle: (title, type) => {
    if (type === 'title') {
      set({ title });
    } else if (type === 'farewell') {
      set({ farewellTitle: title });
    } else if (type === 'desc') {
      set({ farewellDescription: title });
    }
  },
  setFormFirst: (data) => {
    const { durationTimeAnswered, durationTimeRead, questionRetake, title } =
      data;
    set({ title, durationTimeAnswered, durationTimeRead, questionRetake });
  },
  setVideoUrl: (url, type) => {
    if (type === 'intro') {
      set({ introVideoUrl: url });
    } else if (type === 'farewell') {
      set({ farewellVideoUrl: url });
    }
  },
  setQuestion: (data) => set((state) => ({ questions: data })),
  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),
  addQuestion: () =>
    set((state) => ({
      questions: [
        ...state.questions,
        {
          videoUrl: null,
          question: '',
          title: '',
          timeAnswered: 0,
          timeRead: 0,
        },
      ],
    })),
  setFormData: async (data) => {
    const convrt = await blobToFormData(data, 'intro');
    set({ urlAny: convrt });
  },
}));
