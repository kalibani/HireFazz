import { create } from "zustand";

type useUserStore = {
  user: any;
  subscriptionType: string;
  maxFreeCount: number;
  quota: number;
  setQuota: (v: number) => void;
  isQuotaLimited: boolean;
  setQuotaLimited: (v: boolean) => void;
  plan: string;
  setPlan: (v: string) => void;
  setMaxFreeCount: (v: number) => void;
  setUser: (user: any) => void;
  setSubscriptionType: (v: string) => void;
};

export const useUser = create<useUserStore>()((set) => ({
  user: {},
  subscriptionType: "Basic",
  setUser: (user: any) => set({ user: user }),
  setSubscriptionType: (v: string) => set({ subscriptionType: v }),
  maxFreeCount: 25,
  setMaxFreeCount: (v: number) => set({ maxFreeCount: v }),
  quota: 250,
  setQuota: (v: number) => set({ quota: v }),
  isQuotaLimited: false,
  setQuotaLimited: (v: boolean) => set({ isQuotaLimited: v }),
  plan: "BASIC",
  setPlan: (v: string) => set({ plan: v }),
}));
