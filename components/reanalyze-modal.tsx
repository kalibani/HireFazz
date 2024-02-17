"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AlertCircle, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { fileTypes } from "@/types/types";
interface IReanalyzeModal {
  open: boolean;
  onOpenChange: () => void;
  onSubmit: (requirements: string, percentage: number) => void;
  selectedFile: fileTypes;
}

export const ReanalyzeModal = ({
  open,
  onOpenChange,
  onSubmit,
  selectedFile,
}: IReanalyzeModal) => {
  const [requirements, setRequirements] = useState("");
  const [percentage, setPercentage] = useState(60);
  useEffect(() => {
    if (open) {
      // @ts-ignore
      setRequirements(selectedFile?.reportOfAnalysis?.requirements || "");
      setPercentage(60);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col pb-2 gap-y-4">
            <div className="flex items-center py-1 font-bold gap-x-2">
              Input your requirements
            </div>
          </DialogTitle>
          <Textarea
            className="min-h-[150px] max-h-[400px] overflow-auto mt-2"
            placeholder="Type your requirements here."
            rows={15}
            cols={40}
            maxLength={10000}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <div className="flex justify-between mt-[20px]">
            <TooltipProvider>
              <label className="mr-2">
                Set Percentage
                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="cursor-default ml-1.5">
                    <AlertCircle className="w-4 h-4 mt-2 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="p-2 w-80">
                    How many percentage you wanted to match.
                  </TooltipContent>
                </Tooltip>
              </label>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-1.5 w-[250px] hover:bg-transparent ml-auto"
                  aria-label="zoom"
                  variant="outline"
                >
                  {percentage}%
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px]">
                <DropdownMenuItem onSelect={() => setPercentage(20)}>
                  20%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(40)}>
                  40%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(60)}>
                  60%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(80)}>
                  80%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPercentage(100)}>
                  100%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={() => onSubmit(requirements, percentage)}
            className="w-full mt-4"
          >
            Submit
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
