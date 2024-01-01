"use client";

import { FileArchiveIcon, CheckCircle2 } from "lucide-react";
import Heading from "@/components/headings";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/upload-button";

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

const SpeechSynthesisPage = () => {
  const { task, setTask } = useModel();
  const { selectedVoice, selectVoice, formattedVoices, setFormattedVoices } =
    useTextToSpeechStore(useShallow((state) => state));

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

  return (
    <div>
      <Heading
        title="Speech Synthesis (Coming Soon)"
        description="Unleash the power of our cutting-edge technology to generate realistic, captivating speech in a wide range of languages."
        icon={FileArchiveIcon}
        iconColor="text-pink-300"
        bgColor="bg-pink-300/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <div className="rounded-lg w-full border p-4 px-3 md:px-4 focus-within:shadow-sm gap-2 flex h-16 items-center justify-between">
            <h1 className="mb-3text-gray-900">Your creative AI toolkit.</h1>
            <UploadButton isSubscribed={true} buttonText="Add Voice" />
          </div>
          {/* </Form> */}
        </div>
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
                      task === "speech" ? "border-black ring-1 ring-black" : ""
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
                          Create speech by combining the style and content of an
                          audio file you upload with a voice of your choice.
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
                />
                <p className="text-sm text-muted-foreground">
                  Your message will be copied to the support team.
                </p>
                <Button className="my-4">Generate</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* audio player start */}
      {Object.keys(selectedVoice).length > 0 ? (
        <AudioPlayer
          selectedVoice={selectedVoice}
          selectVoice={selectVoice}
          handlePlayVoice={handlePlayVoice}
        />
      ) : null}
      {/* audio player end */}
    </div>
  );
};

export default SpeechSynthesisPage;
