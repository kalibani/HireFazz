import { create } from "zustand";

type usePricingStore = {
  payAsYouGoPrice: number;
  setPayAsYouGoPrice: (v: number) => void;
  price: number;
  setPrice: (v: number) => void;
  characterCount: number;
  setCharacterCount: (v: number) => void;
};

export const usePricing = create<usePricingStore>()((set) => ({
  payAsYouGoPrice: 19000,
  setPayAsYouGoPrice: (v: number) => set({ payAsYouGoPrice: v }),
  price: 249000,
  setPrice: (v: number) => set({ price: v }),
  characterCount: 0,
  setCharacterCount: (v: number) => set({ characterCount: v }),
}));
