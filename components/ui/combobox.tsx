"use client";

import * as React from "react";
import { Check, ChevronDown, Play } from "lucide-react";

import { cn } from "@/lib/utils";
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

interface voicesType {
  voices: string[][];
}

export function ComboboxDemo({ voices }: voicesType | any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : voices && voices[0]?.name}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search voice..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup className="w-full overflow-auto">
            {voices?.length > 0 &&
              voices.map((voice: any) => (
                <CommandItem
                  key={voice.voice_id}
                  value={voice.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex justify-between gap-2">
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
