import { create } from "zustand";

type useProModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isModelModalOpen: boolean;
  onModelModalOpen: () => void;
  onModelModalClose: () => void;
};

export const useProModal = create<useProModalStore>()((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isModelModalOpen: false,
  onModelModalOpen: () => set({ isModelModalOpen: true }),
  onModelModalClose: () => set({ isModelModalOpen: false }),
}));
