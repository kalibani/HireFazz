import axiosInterceptorsInstance from "./interceptors";
import {
  elevenLabsVoices,
  elevenLabsModels,
  elevenLabsDefaultVoiceSettings,
  elevenLabsTextToSpeech,
} from "../urls";

export const getVoices = () => axiosInterceptorsInstance.get(elevenLabsVoices);
export const getModels = () => axiosInterceptorsInstance.get(elevenLabsModels);
export const getVoiceSettings = (voice_id: string) =>
  axiosInterceptorsInstance.get(`${elevenLabsVoices}/${voice_id}/settings`);
export const getDefaultVoiceSettings = () =>
  axiosInterceptorsInstance.get(elevenLabsDefaultVoiceSettings);

export const postTextToSpeech = (
  voice_id: string,
  query: {
    optimize_streaming_latency: number;
    output_format: string;
  },
  payload: any
) =>
  axiosInterceptorsInstance.post(
    `${elevenLabsTextToSpeech}/${voice_id}/stream?optimize_streaming_latency=${query.optimize_streaming_latency}&output_format=${query.output_format}`,
    payload
  );

// pcm_44100
