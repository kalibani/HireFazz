import { create } from 'zustand';

type useTopupModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useTopupModal = create<useTopupModalStore>()((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
