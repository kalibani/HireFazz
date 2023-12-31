import { getVoiceSettings } from "@/lib/axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type voiceSettings = {
  similarity_boost: number[];
  stability: number[];
  style: number[];
  use_speaker_boost: number | string;
};

type voiceSettingsActions = {
  setSimilarityBoost: (v: voiceSettings) => void;
  setStability: (v: voiceSettings) => void;
  setStyle: (v: voiceSettings) => void;
  setSpeaker_boost: (v: voiceSettings) => void;
  setVoiceSettings: (v: voiceSettings) => void;
};

export const useTextToSpeechStore = create<
  voiceSettings & voiceSettingsActions
>()(
  immer((set) => ({
    similarity_boost: [0],
    stability: [0],
    style: [0],
    use_speaker_boost: 0,
    setSimilarityBoost: ({ similarity_boost }: voiceSettings) =>
      set((state) => {
        state.similarity_boost = similarity_boost;
      }),
    setStability: ({ stability }: voiceSettings) =>
      set((state) => {
        state.stability = stability;
      }),
    setStyle: ({ style }: voiceSettings) =>
      set((state) => {
        state.style = style;
      }),
    setSpeaker_boost: ({ use_speaker_boost }: voiceSettings) =>
      set((state) => {
        state.use_speaker_boost = use_speaker_boost;
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
  }))
);
