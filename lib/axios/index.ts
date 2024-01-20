import axiosInterceptorsInstance from "./interceptors";
import {
  elevenLabsVoices,
  elevenLabsModels,
  elevenLabsDefaultVoiceSettings,
  elevenLabsTextToSpeech,
  elevenLabsGeneratedVoices,
  elevenLabsDownloadVoices,
} from "../urls";

export const getVoices = () => axiosInterceptorsInstance.get(elevenLabsVoices);
export const getModels = () => axiosInterceptorsInstance.get(elevenLabsModels);
export const getVoiceSettings = (voice_id: string) =>
  axiosInterceptorsInstance.get(`${elevenLabsVoices}/${voice_id}/settings`);
export const getDefaultVoiceSettings = () =>
  axiosInterceptorsInstance.get(elevenLabsDefaultVoiceSettings);
export const updateVoiceSettings = (payload: any, voice_id: string) =>
  axiosInterceptorsInstance.post(
    `${elevenLabsVoices}/${voice_id}/settings/edit`,
    payload
  );

export const postTextToSpeech = (
  voice_id: string,
  // query: {
  //   optimize_streaming_latency: number;
  //   output_format: string;
  // },
  payload: any,
  responseType: any
) =>
  axiosInterceptorsInstance.post(
    `${elevenLabsTextToSpeech}/${voice_id}/stream`,
    payload,
    {
      responseType: responseType,
    }
  );

export const getGeneratedVoices = (params?: any) =>
  axiosInterceptorsInstance.get(elevenLabsGeneratedVoices, { params });
export const getAudioFromHistory = (historyId: string) =>
  axiosInterceptorsInstance.get(
    `${elevenLabsGeneratedVoices}/${historyId}/audio`,
    {
      responseType: "arraybuffer",
    }
  );
export const downloadHistory = (history_item_ids: string[]) =>
  axiosInterceptorsInstance.post(
    elevenLabsDownloadVoices,
    { history_item_ids },
    { responseType: "blob" }
  );
// pcm_44100
