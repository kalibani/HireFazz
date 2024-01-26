"use client";

import { useEffect, useState, memo } from "react";
import { ChevronDown, Play, Loader, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getVoices } from "@/lib/axios";
import { useModel } from "@/hooks/use-model-modal";
import { useTextToSpeechStore } from "@/hooks/use-text-to-speech";
import { useShallow } from "zustand/react/shallow";

type ComboboxSettingsProps = {
  handlePlayVoice: (v: any) => void;
};

function ComboboxSettings({ handlePlayVoice }: ComboboxSettingsProps) {
  const [open, setOpen] = useState(false);
  const { voiceId, setVoiceId } = useModel(useShallow((state) => state));
  const {
    formattedVoices,
    setFormattedVoices,
    setStream,
    selectVoice,
    selectVoiceTemp,
  } = useTextToSpeechStore(useShallow((state) => state));

  // Queries voices
  const { data, isLoading } = useQuery({
    queryKey: ["voices"],
    queryFn: getVoices,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });
  const voices = data?.data?.voices;
  const tempVoices = data?.data?.voices || [];
  // insert isPlaying to toggle voices
  if (!formattedVoices || formattedVoices?.length === 0) {
    const formatted = voices?.map((v: {}) => ({
      ...v,
      isPlaying: false,
    }));
    setFormattedVoices(formatted);
  }

  useEffect(() => {
    if (!voiceId) {
      const vId = voices?.length > 0 && voices[0].voice_id;
      setVoiceId(vId);
      selectVoiceTemp(voices?.length > 0 && voices[0]);
    }
  }, [voices]);

  const variant = {
    0: "default",
    1: "secondary",
    2: "outline",
    3: "destructive",
    4: "premium",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {voiceId
            ? tempVoices.find(
                (v: any) => v.voice_id.toUpperCase() === voiceId.toUpperCase()
              )?.name
            : voices
            ? voices[0]?.name
            : isLoading
            ? "Please waiting.."
            : "No Data Available"}
          {isLoading ? (
            <Loader className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-follow-trigger">
        <Command>
          <CommandInput placeholder="Search voice..." />
          <CommandEmpty>No voices found.</CommandEmpty>
          <CommandGroup className="w-full overflow-x-hidden overflow-y-auto">
            {formattedVoices?.length > 0 &&
              formattedVoices.map((voice: any) => (
                <CommandItem
                  key={voice.voice_id}
                  value={voice.name}
                  onSelect={() => {
                    setVoiceId(voice.voice_id);
                    selectVoice(voice);
                    setOpen(false);
                    setStream("");
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-start md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        className="inline-flex self-center items-center text-sm font-medium text-center text-gray-900  rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        type="button"
                        onClick={(e) => {
                          handlePlayVoice(voice);
                          setVoiceId(voice.voice_id);
                          setStream("");
                          e.stopPropagation();
                        }}
                      >
                        {voice.isPlaying ? (
                          <Loader2 className="w-4 h-4 text-gray-800 animate-spin" />
                        ) : (
                          <Play
                            className="w-4 h-4 text-gray-800"
                            fill="text-gray-800"
                          />
                        )}
                      </button>
                      <span>{voice.name}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                      {Object.keys(voice?.labels).length > 0
                        ? Object.keys(voice?.labels).map(
                            (label: any, index) => (
                              <Badge
                                // @ts-ignore
                                variant={
                                  variant[index as keyof typeof variant] ||
                                  "premium"
                                }
                                key={index}
                              >
                                {voice?.labels[label]}
                              </Badge>
                            )
                          )
                        : null}
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default memo(ComboboxSettings);
