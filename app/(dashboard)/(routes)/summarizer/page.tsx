"use client";

import { useState } from "react";
import { OpenAI } from "openai";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileArchiveIcon,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
  Trash,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Heading from "@/components/headings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/upload-button";

import { formSchema } from "./constant";
import EmptyPage from "@/components/empty";
import Loader from "@/components/loader";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";
import { trpc } from "@/app/_trpc/client";

import * as formatter from "date-fns";

const ConversationPage = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const router = useRouter();
  const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessage[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const proModal = useProModal();

  // const isLoading = form.formState.isSubmitting;

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const utils = trpc.useUtils();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <div>
      <Heading
        title="Document Summarizer"
        description="Our most advanced conversation model."
        icon={FileArchiveIcon}
        iconColor="text-pink-300"
        bgColor="bg-pink-300/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <div className="rounded-lg w-full border p-4 px-3 md:px-4 focus-within:shadow-sm gap-2 flex h-16 items-center justify-between">
            <h1 className="mb-3text-gray-900">Upload Your Document</h1>
            <UploadButton isSubscribed={true} />
          </div>
          {/* </Form> */}
        </div>
        <div className="space-y-4 mt-4">
          {/* display all user files */}
          {files && files?.length !== 0 ? (
            <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
              {files
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((file) => (
                  <li
                    key={file.id}
                    className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                  >
                    <Link
                      href={`/summarizer/${file.id}`}
                      className="flex flex-col gap-2"
                    >
                      <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        <div className="flex-1 truncate">
                          <div className="flex items-center space-x-3">
                            <h3 className="truncate text-lg font-medium text-zinc-900">
                              {file.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {formatter.format(new Date(file.createdAt), "MMM yyyy")}
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        mocked
                      </div>

                      <Button
                        onClick={() => deleteFile({ id: file.id })}
                        size="sm"
                        className="w-full"
                        variant="destructive"
                      >
                        {currentlyDeletingFile === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : isLoading ? (
            <div className="p-8 rounded-lg w-full flex justify-center items-start bg-muted">
              <Loader />
            </div>
          ) : (
            <EmptyPage label="Pretty empty around here. Let's upload your first PDF." />
          )}

          {/* {isLoading && (
            <div className="p-8 rounded-lg w-full flex justify-center items-start bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <EmptyPage label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message?.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message?.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message?.content}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
