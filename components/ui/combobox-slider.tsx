"use client";

import * as React from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getVoiceSettings } from "@/lib/axios";

interface voicesType extends React.ComponentProps<typeof Slider> {
  voiceId: string;
}

export function ComboboxSlider({ voiceId, className, ...props }: voicesType) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Queries voice settings
  // if (voiceId) {
  const { data } = useQuery({
    queryKey: ["voice-settings", { voiceId: voiceId }],
    queryFn: () => getVoiceSettings(voiceId),
  });
  // const settings = data?.data
  console.log("data", data);
  // }

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
      <PopoverContent>
        <Command className="w-[48vw]">
          <CommandList>
            <CommandGroup heading="Stability" className="w-full">
              <CommandItem className="grid aria-selected:bg-transparent">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
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
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
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
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className={cn("w-[100%] bg-transparent", className)}
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
                  <Checkbox id="terms" />
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
                <Button variant="secondary" className="w-[30%]">
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
