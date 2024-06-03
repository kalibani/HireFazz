import { create } from 'zustand';

type useProModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isModelModalOpen: boolean;
  onModelModalOpen: () => void;
  onModelModalClose: () => void;
  apiLimitCount: number;
  setApiLimit: (apiLimitCount: number) => void;
  payAsYouGoPriceVisible: boolean;
  setPayAsYouGoPriceVisible: (v: boolean) => void;
};

export const useProModal = create<useProModalStore>()((set) => ({
  isOpen: false,
  apiLimitCount: 0,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, payAsYouGoPriceVisible: false }),
  isModelModalOpen: false,
  onModelModalOpen: () => set({ isModelModalOpen: true }),
  onModelModalClose: () => set({ isModelModalOpen: false }),
  setApiLimit: (apiLimitCount: number) => set({ apiLimitCount: apiLimitCount }),
  payAsYouGoPriceVisible: false,
  setPayAsYouGoPriceVisible: (v: boolean) => set({ payAsYouGoPriceVisible: v }),
}));
