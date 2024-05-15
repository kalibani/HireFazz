'use client';
import React from 'react';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import QuestionCard from './question-card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  durationTimeRead: z.string(),
  title: z.string(),
  durationTimeAnswered: z.string(),
});

const FormTemplate = ({ orgId }: { orgId: string }) => {
  const { setFormFirst, introVideoUrl } = useRecorderStore();

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
  }
  return (
    <>
      <div className="mt-5">
        <h3 className="mb-2 text-xl font-semibold">Intro Video</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-x-4">
              <VideoRecord videoUrl={introVideoUrl} />
              <div className="flex-1 gap-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        className="h-auto border text-2xl font-bold ring-0 placeholder:text-2xl"
                        placeholder="Title job here"
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4 flex gap-x-4">
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
              </div>
            </div>

            <div className="my-4">
              <h4 className="text-xl font-semibold">Notification</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-4 text-sm font-normal">
                  <p>Send by email</p>
                  <Button
                    variant="secondary"
                    className="h-0 p-3 text-sm font-normal"
                  >
                    Edit Template
                  </Button>
                </div>
                <div className="flex gap-x-4">
                  <Link href={`/${orgId}/video/create/question`}>
                    <Button
                      className="p-0 text-sm font-normal text-black"
                      variant="link"
                      type="button"
                    >
                      + Add Question
                    </Button>
                  </Link>
                  <Button
                    className="gap-2 px-4 py-2 text-sm font-normal"
                    type="submit"
                  >
                    <Save className="size-4" />
                    Save Question
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <QuestionCard />
      </div>
    </>
  );
};

export default FormTemplate;
