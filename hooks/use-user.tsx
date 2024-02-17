import { create } from "zustand";

type useUserStore = {
  user: any;
  subscriptionType: string;
  setUser: (user: any) => void;
  setSubscriptionType: (v: string) => void;
};

export const useUser = create<useUserStore>()((set) => ({
  user: {},
  subscriptionType: "Basic",
  setUser: (user: any) => set({ user: user }),
  setSubscriptionType: (v: string) => set({ subscriptionType: v }),
}));
