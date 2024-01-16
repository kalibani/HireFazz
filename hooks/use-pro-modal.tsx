import { create } from "zustand";

type useProModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isModelModalOpen: boolean;
  onModelModalOpen: () => void;
  onModelModalClose: () => void;
  apiLimitCount: number;
  setApiLimit: (apiLimitCount: number) => void;
};

export const useProModal = create<useProModalStore>()((set) => ({
  isOpen: false,
  apiLimitCount: 0,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isModelModalOpen: false,
  onModelModalOpen: () => set({ isModelModalOpen: true }),
  onModelModalClose: () => set({ isModelModalOpen: false }),
  setApiLimit: (apiLimitCount: number) => set({ apiLimitCount: apiLimitCount }),
}));
