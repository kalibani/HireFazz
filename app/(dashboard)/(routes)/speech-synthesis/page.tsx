"use client";

import {
  FileArchiveIcon,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Heading from "@/components/headings";
import { Button } from "@/components/ui/button";
// import UploadButton from "@/components/upload-button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useProModal } from "@/hooks/use-pro-modal";
import { useModel } from "@/hooks/use-model-modal";
import { useTextToSpeechStore } from "@/hooks/use-text-to-speech";
import { useShallow } from "zustand/react/shallow";

import { trpc } from "@/app/_trpc/client";

import ComboboxSettings from "@/components/combobox-settings";
import ComboboxSlider from "@/components/combobox-slider";
import { Textarea } from "@/components/ui/textarea";

import { ComboboxModel } from "@/components/combobox-model";

import { cn } from "@/lib/utils";

import AudioPlayer from "@/components/audio-player";
import { FormEvent, useEffect, useState } from "react";
import { postTextToSpeech } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import axios from "axios";
import { FILE_TYPE } from "@/constant";

const SpeechSynthesisPage = () => {
  const { task, setTask, voiceId, model } = useModel();
  const {
    selectedVoice,
    selectVoice,
    formattedVoices,
    setFormattedVoices,
    expanded,
    onExpand,
    similarity_boost,
    stability,
    style,
    use_speaker_boost,
    stream,
    setStream,
    selectedVoiceTemp,
  } = useTextToSpeechStore(useShallow((state) => state));

  const [text, setText] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handlePlayVoice = (voice: any) => {
    // update isPlaying
    const updatedVoices = formattedVoices.map((v: any) =>
      v.voice_id === voice.voice_id
        ? {
            ...v,
            isPlaying: !voice.isPlaying,
          }
        : {
            ...v,
            isPlaying: false,
          }
    );
    setFormattedVoices(updatedVoices);
    // set voice to store
    const updatedVoice = {
      ...voice,
      isPlaying: !voice.isPlaying,
    };
    selectVoice(updatedVoice);
  };

  const createFile = trpc.createFile.useMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      console.log("voiceId", voiceId);
      const voice_settings = {
        similarity_boost: similarity_boost[0],
        stability: stability[0],
        style: style[0],
        use_speaker_boost: use_speaker_boost,
      };
      console.log("setting", voice_settings);
      console.log("model", model);
      console.log("text", text);
      console.log("selectedVoice", selectedVoice);

      const payload = {
        // @ts-ignore
        model_id: model?.model_id,
        text: text,
        // voice_settings,
      };

      const query = {
        optimize_streaming_latency: 2,
        output_format: "pcm_44100",
      };

      const responseType = "arraybuffer";
      const response = await postTextToSpeech(
        voiceId,
        query,
        payload,
        responseType
      );

      const data = response.data;
      // @ts-ignore
      const blobFile = new File([data], selectedVoice.name || "audio", {
        type: "audio/mpeg",
        lastModified: Date.now(),
      });

      const formData = new FormData();
      formData.append("files", blobFile);

      const responseUpload = await axios.post("/api/uploadVoice", formData);

      const file = {
        key: responseUpload.data.data.key as string,
        name: responseUpload.data.data.name as string,
        type: FILE_TYPE.VOICE,
      };

      await createFile.mutate(file);

      const url = responseUpload.data.data.url;
      setStream(url);
    } catch (error) {
      console.log("e", error);
      toast("We faced some issue");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const handleComingSoon = () => {
    router.push("/coming-soon");
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (task === "speech") {
      timeout = setTimeout(() => {
        handleComingSoon();
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      setTask("text");
    };
  }, [task]);

  return (
    <div>
      <Heading
        title="Speech Synthesis"
        description="Unleash the power of our cutting-edge technology to generate realistic, captivating speech in a wide range of languages."
        icon={FileArchiveIcon}
        iconColor="text-pink-300"
        bgColor="bg-pink-300/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <div className="rounded-lg w-full border p-4 px-3 md:px-4 focus-within:shadow-sm gap-2 flex h-16 items-center justify-between">
            <h1 className="mb-3text-gray-900">Your creative AI toolkit.</h1>
            <Button variant="default" onClick={handleComingSoon}>
              Add Your Voice
            </Button>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-4 mt-4 border border-gray-200 shadow-sm rounded-lg bg-white">
            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 pt-6 lg:pt-5 mb-5">
              <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
                <span>Task</span>
              </span>
              <div className="mt-1 lg:col-span-5 lg:mt-0 flex items-start">
                <div>
                  <div className="space-x-3 flex">
                    <div
                      className={cn(
                        "border-gray-300 hover:border-gray-900 relative flex cursor-pointer rounded-lg border bg-white py-2 px-3 gap-1.5 shadow-sm focus:outline-none max-w-xs",
                        task === "text" ? "border-black ring-1 ring-black" : ""
                      )}
                      role="presentation"
                      onClick={() => setTask("text")}
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            Text to speech
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Convert text into lifelike speech using a voice of
                            your choice.
                          </span>
                        </span>
                      </span>
                      {task === "text" ? <CheckCircle2 /> : null}
                    </div>
                    <div
                      className={cn(
                        "border-gray-300 hover:border-gray-900 relative flex cursor-pointer rounded-lg border bg-white py-2 px-3 gap-1.5 shadow-sm focus:outline-none max-w-xs",
                        task === "speech"
                          ? "border-black ring-1 ring-black"
                          : ""
                      )}
                      role="presentation"
                      onClick={() => setTask("speech")}
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            Speech to speech
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Create speech by combining the style and content of
                            an audio file you upload with a voice of your
                            choice.
                          </span>
                        </span>
                      </span>
                      {task === "speech" ? <CheckCircle2 /> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:border-gray-200 lg:gap-4 pt-5 lg:border-t">
              <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
                <span>Setting</span>
              </span>
              <div className="flex mt-1 lg:col-span-5 lg:mt-0 items-start">
                <ComboboxSettings handlePlayVoice={handlePlayVoice} />
              </div>
            </div>

            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 mt-5 lg:mt-5">
              <div></div>
              <div className="flex mt-1 lg:col-span-5 lg:mt-0 items-start">
                <ComboboxSlider />
              </div>
            </div>

            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 mt-5 lg:mt-5">
              <div></div>
              <div className="flex mt-1 lg:col-span-5 lg:mt-0 items-start">
                <ComboboxModel />
              </div>
            </div>

            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:border-gray-200 lg:gap-4 pt-5 lg:border-t">
              <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
                <span>Text</span>
              </span>
              <div className="mt-1 lg:col-span-5 lg:mt-0">
                <div className="grid w-full gap-2">
                  <Textarea
                    className=" min-h-[150px]"
                    placeholder="Type your message here."
                    rows={15}
                    cols={40}
                    maxLength={2500}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <Button
                    className="my-4 flex gap-4"
                    disabled={!text || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 text-gray-800 animate-spin" />
                    ) : null}
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* audio player start */}
      {(stream || Object.keys(selectedVoice).length) && expanded ? (
        <AudioPlayer
          selectedVoice={selectedVoice}
          selectVoice={selectVoice}
          handlePlayVoice={handlePlayVoice}
          onExpand={onExpand}
          stream={stream}
          selectedVoiceTemp={selectedVoiceTemp}
        />
      ) : null}

      {!expanded ? (
        <div className="fixed bottom-0 z-10 right-0 mr-3 mb-3">
          <button
            onClick={() => onExpand(true)}
            className="rounded-[50%] w-10 h-10 bg-black focus:outline-none flex justify-center items-center"
          >
            <ChevronDown color="white" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SpeechSynthesisPage;
