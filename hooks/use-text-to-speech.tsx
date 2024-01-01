import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type voices = {
  isPlaying: boolean;
  formattedVoices: any[];
  selectedVoice: {};
};

type voicesAction = {
  setPlaying: (t: boolean) => void;
  setFormattedVoices: (v: any[]) => void;
  selectVoice: (v: {}) => void;
};

type voiceSettings = {
  similarity_boost: number[];
  stability: number[];
  style: number[];
  use_speaker_boost: any;
};

type voiceSettingsActions = {
  setSimilarityBoost: (v: number[]) => void;
  setStability: (v: number[]) => void;
  setStyle: (v: number[]) => void;
  setSpeaker_boost: (v: any) => void;
  setVoiceSettings: (v: voiceSettings) => void;
};

export const useTextToSpeechStore = create<
  voiceSettings & voiceSettingsActions & voices & voicesAction
>()(
  immer((set) => ({
    similarity_boost: [0],
    stability: [0],
    style: [0],
    use_speaker_boost: false,
    isPlaying: false,
    setPlaying: (t) =>
      set((state) => {
        state.isPlaying = t;
      }),
    setSimilarityBoost: (v) =>
      set((state) => {
        state.similarity_boost = v;
      }),
    setStability: (v) =>
      set((state) => {
        state.stability = v;
      }),
    setStyle: (v) =>
      set((state) => {
        state.style = v;
      }),
    setSpeaker_boost: (v) =>
      set((state) => {
        state.use_speaker_boost = v;
      }),
    setVoiceSettings: ({
      similarity_boost,
      stability,
      style,
      use_speaker_boost,
    }: voiceSettings) =>
      set((state) => {
        (state.similarity_boost = similarity_boost),
          (state.stability = stability),
          (state.style = style),
          (state.use_speaker_boost = use_speaker_boost);
      }),
    setFormattedVoices: (v) =>
      set((state) => {
        state.formattedVoices = v;
      }),
    selectedVoice: {},
    formattedVoices: [],
    selectVoice: (v) =>
      set((state) => {
        state.selectedVoice = v;
      }),
  }))
);
