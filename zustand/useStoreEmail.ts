import { create } from 'zustand';

export type TStoreEmail = {
  ids: Array<string>;
  setIds: (ids: Array<string>) => void;
};

export const useStoreEmail = create<TStoreEmail>((set) => ({
  ids: [],
  setIds: (ids: Array<string>) => set({ ids }),
}));
