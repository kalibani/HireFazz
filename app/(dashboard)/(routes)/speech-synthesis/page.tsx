"use client";
import { FormEvent, useEffect, useState } from "react";

import {
  FileArchiveIcon,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Heading from "@/components/headings";
import { Button } from "@/components/ui/button";

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
import { postTextToSpeech, getGeneratedVoices } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

import { useQueryClient } from "@tanstack/react-query";
import { usePricing } from "@/hooks/use-pricing";
import { useMidtransStore } from "@/hooks/use-midtrans-store";
import axios from "axios";

const SpeechSynthesisPage = () => {
  const { task, setTask, voiceId, model } = useModel();
  const {
    selectedVoice,
    selectVoice,
    formattedVoices,
    setFormattedVoices,
    expanded,
    onExpand,
    stream,
    setStream,
    selectedVoiceTemp,
    setHistoryItemId,
    historyItemId,
  } = useTextToSpeechStore(useShallow((state) => state));

  // const getGeneratedVoice =
  //   trpc.getGeneratedVoice.useQuery();

  // const handleUpdate = async () => {
  //   const resp = await getGeneratedVoice.mutate({
  //     historyItemId: historyItemId,
  //     isPaid: true,
  //   });
  // };

  // useEffect(() => {
  //   handleUpdate();
  // }, [historyItemId]);

  const { onReset } = useMidtransStore();

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

  const saveGeneratedVoice = trpc.saveGeneratedVoice.useMutation();

  const queryClient = useQueryClient();
  const handleSaveGeneratedVoice = async (now: any) => {
    const params = {
      page_size: 20,
    };
    try {
      // get newly generated
      const { data } = await queryClient.fetchQuery({
        queryKey: ["get-generated-voices"],
        queryFn: () => getGeneratedVoices(params),
      });

      const dateUnix = Math.round(now / 1000);

      if (data.history.length > 0) {
        const history = data.history.filter(
          (element: any) =>
            element.text === text &&
            element.voice_id === voiceId &&
            // @ts-ignore
            element.model_id === model.model_id &&
            element.date_unix === dateUnix
        )[0];
        // save newly generated to prisma
        if (history) {
          const payload = {
            characterCountChangeFrom: history.character_count_change_from,
            characterCountChangeTo: history.character_count_change_to,
            contentType: history.content_type,
            dateUnix: history.date_unix,
            feedback: history.feedback,
            historyItemId: history.history_item_id,
            modelId: history.model_id,
            requestId: history.request_id,
            settings: history.settings,
            shareLinkId: history.share_link_id,
            state: history.state,
            text: history.text,
            voiceCategory: history.voice_category,
            voiceId: history.voice_id,
            voiceName: history.voice_name,
          };
          setHistoryItemId(history.history_item_id);

          // set to local storage
          // localStorage.setItem("historyItemId", history.history_item_id);
          saveGeneratedVoice.mutate(payload);
        }
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const { setCharacterCount } = usePricing();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // reset midtrans store before generate voice
    onReset();

    try {
      e.preventDefault();
      setLoading(true);

      const payload = {
        // @ts-ignore
        model_id: model?.model_id,
        text: text,
      };

      // const query = {
      //   optimize_streaming_latency: 2,
      //   output_format: "pcm_44100",
      // };

      const responseType = "arraybuffer";

      const response = await postTextToSpeech(
        voiceId,
        // query,
        payload,
        responseType
      );

      const data = response.data;
      const blob = new Blob([data], {
        type: "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);
      setStream(url);

      // set character count for pricing
      const characterCount = text.length;
      setCharacterCount(characterCount);
    } catch (error) {
      console.log("e", error);
      toast("We faced some issue");
    } finally {
      setLoading(false);
      const now = Date.now();
      handleSaveGeneratedVoice(now);
    }
  };

  const characterLimit = 5000;

  const router = useRouter();
  const handleUpdateUserLimit = async () => {
    try {
      await axios.post("/api/update-user-limit");
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  // TEMPORARY COMMENTED

  // const utils = trpc.useUtils();

  // const handleGetGeneratedVoice = async (historyItemIdSaved: string) => {
  //   const response = await utils.getGeneratedVoice.fetch({
  //     historyItemId: historyItemIdSaved,
  //   });
  // };

  // useEffect(() => {
  //   const historyItemIdSaved =
  //     historyItemId || localStorage.getItem("historyItemId");

  //   if (historyItemIdSaved) {
  //     handleGetGeneratedVoice(historyItemIdSaved);
  //   }
  // }, []);

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
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-4 mt-4 border border-gray-200 shadow-sm rounded-lg bg-white">
            <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 pt-6 lg:pt-5 mb-5">
              <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
                <span>Task</span>
              </span>
              <div className="mt-1 lg:col-span-5 lg:mt-0 flex items-start">
                <div>
                  <div className="space-y-3 lg:space-x-3 lg:space-y-0 flex flex-wrap lg:flex-nowrap">
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
                      // onClick={() => setTask("speech")}
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="flex items-center justify-between">
                            <span className="block text-sm font-medium text-gray-900">
                              Speech to speech
                            </span>
                            <Badge>Coming soon</Badge>
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
                <span>Settings</span>
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
                    maxLength={characterLimit}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {text.length} / {characterLimit}
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
          updateUserLimit={handleUpdateUserLimit}
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
