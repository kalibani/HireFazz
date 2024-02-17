import { create } from "zustand";

type useUserStore = {
  user: any;
  subscriptionType: string;
  maxFreeCount: number;
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
}));
