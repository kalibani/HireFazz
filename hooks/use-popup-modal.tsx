import { create,  } from "zustand";

type MODAL_TYPE = 'BANK_CV' | 'THIRD_PARTY'

type usePopupModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isModalOpen: (type: MODAL_TYPE) => boolean;
  openMap: Record<MODAL_TYPE, boolean>
  setIsModalOpen: (type: MODAL_TYPE, value: boolean) => void
};

export const usePopupModal = create<usePopupModalStore>()((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  openMap: {
    BANK_CV: false,
    THIRD_PARTY: false
  },
  isModalOpen: (type) => get().openMap[type],
  setIsModalOpen: (type, value) => set(state => {
    const newOpenMap = {...state.openMap}
    newOpenMap[type] = value

    return {
      ...state,
      openMap: newOpenMap
    }
  })
}));
