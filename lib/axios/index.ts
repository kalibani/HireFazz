import axiosInterceptorsInstance from "./interceptors";
import { elevenLabsVoices, elevenLabsModels } from "../urls";

export const getVoices = () => axiosInterceptorsInstance.get(elevenLabsVoices);
export const getModels = () => axiosInterceptorsInstance.get(elevenLabsModels);
export const getVoiceSettings = (voice_id: string) =>
  axiosInterceptorsInstance.get(`${elevenLabsVoices}/${voice_id}/settings`);