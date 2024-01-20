import { create } from "zustand";

type usePricingStore = {
  payAsYouGoPrice: number;
  setPayAsYouGoPrice: (v: number) => void;
  characterCount: number;
  setCharacterCount: (v: number) => void;
  subscriptionType: string;
};

export const usePricing = create<usePricingStore>()((set) => ({
  subscriptionType: "FREE",
  payAsYouGoPrice: 19000,
  setPayAsYouGoPrice: (v: number) => set({ payAsYouGoPrice: v }),
  characterCount: 0,
  setCharacterCount: (v: number) => set({ characterCount: v }),
}));
