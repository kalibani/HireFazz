import { create } from "zustand";

type useModelStore = {
  isModelModalOpen: boolean;
  onModelModalOpen: (v: boolean) => void;
  onModelModalClose: () => void;
  model: {};
  setModel: (model: {}) => void;
  task: string;
  setTask: (t: string) => void;
  voiceId: string;
  setVoiceId: (v: string) => void;
};

export const useModel = create<useModelStore>()((set) => ({
  isModelModalOpen: false,
  onModelModalOpen: (v) => set({ isModelModalOpen: v }),
  onModelModalClose: () => set({ isModelModalOpen: false }),
  model: { name: "Select Model" },
  setModel: (model) => set({ model: model }),
  task: "text",
  setTask: (t) => set({ task: t }),
  voiceId: "",
  setVoiceId: (v) => set({ voiceId: v }),
}));
