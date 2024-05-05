'use client';
import React, { startTransition } from 'react';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useRecorderStore } from '@/zustand/recordedStore';
import VideoRecord from './video-record';
import { uploadVideo } from '@/lib/actions/interview/uploadVideo';
import { useMutation } from '@tanstack/react-query';

const FormSchema = z.object({
  durationTimeRead: z.string(),
  title: z.string(),
  durationTimeAnswered: z.string(),
});

const CreateIntroInterview = () => {
  const { setFormFirst, introVideoUrl } = useRecorderStore();
  const { mutate } = useMutation({
    mutationKey: ['video-intro'],
    mutationFn: uploadVideo,
    onSuccess: (data: any) => {
      console.log(data, '?');
    },
    onError: ({ error }) => {
      console.log(error, '?');
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { title, durationTimeAnswered, durationTimeRead } = data;
    setFormFirst({
      title,
      durationTimeAnswered: Number(durationTimeAnswered),
      durationTimeRead: Number(durationTimeRead),
    });
    // startTransition(() => {
    //   {
    //     introVideoUrl && mutate(introVideoUrl);
    //   }
    // });
  }
  // console.log({ introVideoUrl });
  return (
    <div className="flex  gap-x-4 rounded-md  bg-white p-4">
      <VideoRecord videoUrl={introVideoUrl} />
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Input
                    className="h-auto border-none text-2xl font-bold ring-0 placeholder:text-2xl"
                    placeholder="Title job here"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-4">
              <FormField
                control={form.control}
                name="durationTimeRead"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      CANDIDATE THINKING TIME
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">none</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minutes</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationTimeAnswered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      CANDIDATE MAX ANSWER LENGTH PER QUESTION
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="60">1 minutes</SelectItem>
                        <SelectItem value="120">2 minutes</SelectItem>
                        <SelectItem value="180">3 minutes</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateIntroInterview;
