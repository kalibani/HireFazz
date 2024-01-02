"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

import { useModel } from "@/hooks/use-model-modal";

interface voicesType extends React.ComponentProps<typeof Slider> {
  voices: string[][];
  isLoading: boolean;
}

export function ComboboxModel({
  voices,
  isLoading,
  className,
  models,
  ...props
}: voicesType | any) {
  const { isModelModalOpen, onModelModalOpen, model } = useModel();

  return (
    <Popover open={isModelModalOpen} onOpenChange={onModelModalOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isModelModalOpen}
          className="w-full justify-between"
        >
          {/* @ts-ignore */}
          {model && model?.name}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
