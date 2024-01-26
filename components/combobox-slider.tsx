"use client";

import { useEffect, useState, memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getVoiceSettings,
  getDefaultVoiceSettings,
  updateVoiceSettings,
} from "@/lib/axios";
import { useTextToSpeechStore } from "@/hooks/use-text-to-speech";
import { useModel } from "@/hooks/use-model-modal";

function ComboboxSlider({
  className,
  ...props
}: React.ComponentProps<typeof Slider>) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = React.useState("");
  const { voiceId } = useModel();

  const {
    stability,
    similarity_boost,
    style,
    use_speaker_boost,
    setSimilarityBoost,
    setStability,
    setStyle,
    setSpeaker_boost,
    setVoiceSettings,
  } = useTextToSpeechStore(useShallow((state) => state));

  // Queries voice settings
  // const { data, isError, isLoading } = useQuery({
  //   queryKey: ["voice-settings", { voiceId: voiceId }],
  //   queryFn: () => getVoiceSettings(voiceId),
  //   staleTime: 1000 * 60 * 60 * 24,
  //   cacheTime: 1000 * 60 * 60 * 24,
  // });

  const queryClient = useQueryClient();

  const handleGetVoiceSettings = async (voiceId: string) => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ["voice-settings", { voiceId: voiceId }],
      queryFn: () => getVoiceSettings(voiceId),
    });

    if (data) {
      const voiceSettings = {
        stability: [data?.stability * 100],
        similarity_boost: [data?.similarity_boost * 100],
        style: [data?.style * 100],
        use_speaker_boost: data?.use_speaker_boost,
      };

      setVoiceSettings(voiceSettings);
    }
  };

  const handleGetDefaultVoiceSettings = async () => {
    const { data } = await queryClient.fetchQuery({
      queryKey: ["default-voice-settings"],
      queryFn: () => getDefaultVoiceSettings(),
    });

    if (data) {
      const voiceSettings = {
        stability: [data?.stability * 100],
        similarity_boost: [data?.similarity_boost * 100],
        style: [data?.style * 100],
        use_speaker_boost: data?.use_speaker_boost,
      };

      setVoiceSettings(voiceSettings);
    }
  };

  const handleUpdateVoiceSettings = async (settings: any, value: any) => {
    const voiceSettings = {
      stability: stability[0] / 100,
      similarity_boost: similarity_boost[0] / 100,
      style: style[0] / 100,
      use_speaker_boost: use_speaker_boost,
    };

    const payload = {
      ...voiceSettings,
      [settings]: Array.isArray(value) ? value[0] / 100 : value,
    };

    await updateVoiceSettings(payload, voiceId);
    await handleGetVoiceSettings(voiceId);
  };

  useEffect(() => {
    if (voiceId) {
      handleGetVoiceSettings(voiceId);
    }
  }, [voiceId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          Voice Settings
          {open ? (
            <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-follow-trigger">
        <Command>
          <CommandList>
            <CommandGroup heading="Stability" className="w-full">
              <CommandItem className="grid aria-selected:bg-transparent">
                <Slider
                  value={stability}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
                  onValueChange={(value) =>
                    handleUpdateVoiceSettings("stability", value)
                  }
                  {...props}
                />
                <div className="flex mt-2 justify-between">
                  <div className="flex items-center">
                    <span>More variable</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                          <p>
                            Increasing variability can make speech more
                            expressive with output varying between
                            re-generations. It can also lead to instabilities.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center">
                    <span>More Stable</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                          <p>
                            Increasing stability will make the voice more
                            consistent between re-generations, but it can also
                            make it sounds a bit monotone. On longer text
                            fragments we recommend lowering this value.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Clarity + Similarity Enhancement">
              <CommandItem className="grid aria-selected:bg-transparent">
                <Slider
                  value={similarity_boost}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
                  onValueChange={(value) =>
                    handleUpdateVoiceSettings("similarity_boost", value)
                  }
                  {...props}
                />
                <div className="flex mt-2 justify-between">
                  <div className="flex items-center">
                    <span>Low</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                          <p>
                            Low values are recommended if background artifacts
                            are present in generated speech.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center">
                    <span>High</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                          <p>
                            High enhancement boosts overall voice clarity and
                            target speaker similarity. Very high values can
                            cause artifacts, so adjusting this setting to find
                            the optimal value is encouraged
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Style Exaggeration">
              <CommandItem className="grid aria-selected:bg-transparent">
                <Slider
                  value={style}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
                  name="style"
                  onValueChange={(value) =>
                    handleUpdateVoiceSettings("style", value)
                  }
                  {...props}
                />
                <div className="flex mt-2 justify-between">
                  <div className="flex items-center">
                    <span>None (Fastest)</span>
                  </div>
                  <div className="flex items-center">
                    <span>Exaggerated</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                          <p>
                            High values are recommended if the style of the
                            speech should be exaggerated compared to the
                            uploaded audio. Higher values can lead to more
                            instability in the generated speech. Setting this to
                            0.0 will greatly increase generation speed and is
                            the default setting.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              <CommandItem className="grid aria-selected:bg-transparent">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use_speaker_boost"
                    checked={use_speaker_boost}
                    value={use_speaker_boost}
                    // onCheckedChange={setSpeaker_boost}
                    onCheckedChange={(value) =>
                      handleUpdateVoiceSettings("use_speaker_boost", value)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Speaker Boost
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] bg-gray-700 text-white">
                        <p>
                          Boost the similarity of the synthesized speech and the
                          voice at the cost of some generation speed.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandGroup>
              <CommandItem className="grid aria-selected:bg-transparent">
                <Button
                  variant="secondary"
                  className="w-fit md:w-[30%]"
                  onClick={handleGetDefaultVoiceSettings}
                >
                  To Default
                </Button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default memo(ComboboxSlider);
