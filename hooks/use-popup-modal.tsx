import { create } from "zustand";

export enum MODAL_ENUM {
  BANK_CV = 'BANK_CV',
  THIRD_PARTY_CV = 'THIRD_PARTY_CV'
}

type usePopupModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isModalOpen: (type: MODAL_ENUM) => boolean;
  getOpenModalEnum: () => MODAL_ENUM | undefined;
  openMap: Record<MODAL_ENUM, boolean>
  setIsModalOpen: (type: MODAL_ENUM, value: boolean) => void
};

export const usePopupModal = create<usePopupModalStore>()((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  openMap: {
    [MODAL_ENUM.BANK_CV]: false,
    [MODAL_ENUM.THIRD_PARTY_CV]: false
  },
  isModalOpen: (type) => get().openMap[type],
  getOpenModalEnum: () => {
    // get enum of the opened modal
    const openMap = get().openMap
    const openEnum = Object.keys(openMap) as MODAL_ENUM[]
    return openEnum.find((key) => openMap[key])
  },
  setIsModalOpen: (type, value) => set(state => {
    // todo: handle only single modal could open in one time
    const newOpenMap = {...state.openMap}
    newOpenMap[type] = value

    return {
      ...state,
      openMap: newOpenMap
    }
  })
}));
