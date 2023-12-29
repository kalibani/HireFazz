"use client";

import { useEffect, useState } from "react";
import { OpenAI } from "openai";
import {
  FileArchiveIcon,
  Loader2,
  MessageSquare,
  Plus,
  Trash,
  ChevronDown,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Heading from "@/components/headings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/upload-button";

import EmptyPage from "@/components/empty";
import Loader from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { trpc } from "@/app/_trpc/client";

import * as formatter from "date-fns";
import { ComboboxDemo } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { NextApiResponse } from "next";

const SpeechSynthesisPage = () => {
  const [voices, setVoices] = useState<any>();
  const proModal = useProModal();

  const getVoices = async () => {
    try {
      const response: any = await axios.get(
        "https://api.elevenlabs.io/v1/voices"
      );
      setVoices(response?.data?.voices);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getVoices();
  }, []);

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
            <UploadButton isSubscribed={true} buttonText="Add Voice" />
          </div>
          {/* </Form> */}
        </div>
        <div className="space-y-4 mt-4 border border-gray-200 shadow-sm rounded-lg bg-white">
          {/* display all user files */}
          <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 pt-6 lg:pt-5 mb-5">
            <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
              <span>Task</span>
            </span>
            <div className="mt-1 lg:col-span-5 lg:mt-0 flex gap-4 items-start">
              <div>
                <div className="space-x-3 flex">
                  <div className="border-black ring-1 ring-black relative flex cursor-pointer rounded-lg border bg-white py-2 px-3 gap-1.5 shadow-sm focus:outline-none max-w-xs">
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
                  </div>
                  <div className="border-gray-300 hover:border-gray-900 relative flex cursor-pointer rounded-lg border bg-white py-2 px-3 gap-1.5 shadow-sm focus:outline-none max-w-xs">
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
              <ComboboxDemo voices={voices} />
            </div>
          </div>

          <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 mt-5 lg:mt-5">
            <div></div>
            <div className="flex mt-1 lg:col-span-5 lg:mt-0 items-start">
              {/* <ComboboxDemo /> */}
            </div>
          </div>

          <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:gap-4 mt-5 lg:mt-5">
            <div></div>
            <div className="flex mt-1 lg:col-span-5 lg:mt-0 items-start">
              {/* <ComboboxDemo /> */}
            </div>
          </div>

          <div className="px-8 lg:grid lg:grid-cols-7 lg:items-start lg:border-gray-200 lg:gap-4 pt-5 lg:border-t">
            <span className="block text-lg font-normal text-gray-900 mb-1 leading-none pb-1 lg:pb-0">
              <span>Text</span>
            </span>
            <div className="mt-1 lg:col-span-5 lg:mt-0">
              <div className="grid w-full gap-2">
                <Textarea
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
    </div>
  );
};

export default SpeechSynthesisPage;
