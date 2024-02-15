"use client";

import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useModel } from "@/hooks/use-model-modal";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "@/lib/axios";
import { useEffect, useState } from "react";

const ModelModal = () => {
  const { isModelModalOpen, onModelModalClose, setModel, task, model } =
    useModel();
  const { data, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchOnWindowFocus: false,
  });
  const models =
    task === "text"
      ? data?.data
      : data?.data.filter(
          (model: any) => model.model_id === "eleven_english_sts_v2"
        );

  const handleSelectModel = (model: {}) => {
    onModelModalClose();
    setModel(model);
  };

  useEffect(() => {
    // reset default value for speech to text
    if (task === "speech") {
      // const model = {
      //   name: "Select Model",
      // };
      setModel(models[0]);
    }
  }, [task]);

  useEffect(() => {
    if (task === "text") {
      // @ts-ignore
      if (model && model.name !== "Select Model") {
        setModel(model);
      } else {
        setModel(models && models[0]);
      }
    }
  }, [models]);

  return (
    <Dialog open={isModelModalOpen} onOpenChange={onModelModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex  flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Choose a Model to use
            </div>
          </DialogTitle>
          <DialogDescription className="pt-2 space-y-2 text-zinc-900 font-medium max-h-96 overflow-auto">
            {models?.map((model: any) => (
              <Card
                role="presentation"
                onClick={() => handleSelectModel(model)}
                key={model.model_id}
                className="p-3 border-black/5 cursor-pointer hover:bg-gray-50 text-[#6f7082]"
              >
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {model.name}
                  </h1>
                  <p className="max-w-md">{model.description}</p>
                  <div className="flex items-center py-1 font-bold text-gray-600 gap-x-2">
                    Tasks:
                    <Badge className="text-xs py-1 bg-[#DBEAFE] hover:bg-[#DBEAFE] text-[#6f7082]">
                      {task === "text" ? "Text to Speech" : "Speech to Speech"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center max-w-md py-1 overflow-auto font-bold text-gray-600 gap-x-2 gap-y-2">
                    Languages:
                    {model.languages?.length > 0 &&
                      model.languages.map(
                        (language: { id: ""; name: "" }, idx: number) => (
                          <Badge
                            className="text-xs py-1  text-[#6f7082]"
                            variant="outline"
                            key={`${language.id}-${idx}`}
                          >
                            {language.name}
                          </Badge>
                        )
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* <Button variant="premium" size="lg" className="w-full">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelModal;
