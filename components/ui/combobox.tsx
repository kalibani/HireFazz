"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Play, Loader } from "lucide-react";
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
import { Badge } from "./badge";
import { useQuery } from "@tanstack/react-query";
import { getVoices } from "@/lib/axios";

type ComboboxProps = {
  voiceId: string;
  handleSetVoice: (v: string) => void;
};

export function Combobox({ voiceId, handleSetVoice }: ComboboxProps) {
  const [open, setOpen] = useState(false);

  // Queries voices
  const { data, isLoading } = useQuery({
    queryKey: ["voices"],
    queryFn: getVoices,
  });
  const voices = data?.data?.voices;
  const tempVoices = data?.data?.voices;

  useEffect(() => {
    const vId = voices?.length > 0 && voices[0].voice_id;

    handleSetVoice(vId);
  }, [voices]);

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
      <PopoverContent>
        <Command className="w-[48vw]">
          <CommandInput placeholder="Search voice..." />
          <CommandEmpty>No voices found.</CommandEmpty>
          <CommandGroup className="w-full overflow-auto">
            {voices?.length > 0 &&
              voices.map((voice: any) => (
                <CommandItem
                  key={voice.voice_id}
                  value={voice.voice_id}
                  onSelect={(currentValue) => {
                    handleSetVoice(voice.voice_id);
                    setOpen(false);
                  }}
                >
                  <div className="flex justify-between gap-4">
                    <Play className="h-4 w-4 text-gray-600" />
                    <span>{voice.name}</span>
                    {voice?.labels.accent && (
                      <Badge variant="secondary">{voice?.labels.accent}</Badge>
                    )}

                    {voice?.labels.description && (
                      <Badge variant="default">
                        {voice?.labels.description}
                      </Badge>
                    )}

                    {voice?.labels["use case"] && (
                      <Badge variant="outline">
                        {voice?.labels["use case"]}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
