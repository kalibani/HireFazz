import { create } from "zustand";

type useAnalyzerStore = {
  requirements: string;
  setRequirements: (v: string) => void;
  percentage: number;
  setPercentage: (v: number) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
};

export const useAnalyzer = create<useAnalyzerStore>()((set) => ({
  requirements: "",
  setRequirements: (v) => set({ requirements: v }),
  percentage: 60,
  setPercentage: (v) => set({ percentage: v }),
  jobTitle: "",
  setJobTitle: (v: string) => set({ jobTitle: v }),
}));
