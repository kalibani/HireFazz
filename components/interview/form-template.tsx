'use client';
import React, { useEffect, useTransition } from 'react';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Button } from '../ui/button';
import { Save, Video } from 'lucide-react';
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
} from '@/components/ui/select';
import QuestionCard from './question-card';
import Link from 'next/link';
import createTemplateInterview from '@/lib/actions/interview/createTemplateInterview';
import { useMutation } from '@tanstack/react-query';
import { errorHandler } from '@/helpers';
import { uploadVideo } from '@/lib/actions/interview/uploadVideo';
import { blobToFormData } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { CreateTemplateInterview } from '@/lib/validators/interview';

const FormSchema = z.object({
  durationTimeRead: z.string(),
  title: z.string(),
  durationTimeAnswered: z.string(),
  description: z.string(),
  descriptionIntro: z.string().optional(),
});

const FormTemplate = ({ orgId }: { orgId: string }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { replace } = useRouter();
  const { introVideoUrl, questions, setIsLoading } = useRecorderStore();
  const [isPending, startTransition] = useTransition();

  const { mutate } = useMutation({
    mutationKey: ['create-template'],
    mutationFn: (payload: z.infer<typeof CreateTemplateInterview>) =>
      createTemplateInterview(payload),
    onSuccess: () => {
      replace(`/${orgId}/video`);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (isPending) {
      setIsLoading(isPending);
    }
  }, [isPending, setIsLoading]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { title, durationTimeAnswered, durationTimeRead } = data;

    if (questions.length > 0) {
      startTransition(async () => {
        try {
          const payloadQuestions: any = questions.map(async (item) => {
            const urlFormData: any =
              item.videoUrl &&
              (await blobToFormData(item.videoUrl, 'questions'));
            const url = urlFormData && (await uploadVideo(urlFormData));
            return {
              ...item,
              timeAnswered: !item.timeAnswered
                ? Number(durationTimeAnswered)
                : Number(item.timeAnswered),
              timeRead: !item.timeRead
                ? Number(durationTimeRead)
                : Number(item.timeRead),
              videoUrl: url ?? '',
              description: item.question,
              questionRetake: 0,
            };
          });
          const resolvedQuestions = await Promise.all(payloadQuestions);
          if (orgId) {
            const introVideo =
              introVideoUrl && (await blobToFormData(introVideoUrl, 'intro'));
            const introUrl = introVideo && (await uploadVideo(introVideo));
            const payload: z.infer<typeof CreateTemplateInterview> = {
              organizationId: orgId,
              title,
              durationTimeAnswered: Number(durationTimeAnswered),
              durationTimeRead: Number(durationTimeRead),
              introVideoUrl: introUrl as string,
              questions: resolvedQuestions,
            };
            mutate(payload);
          }
        } catch (error) {
          errorHandler(error);
        }
      });
    }
  };
  return (
    <>
      <div className="mt-5">
        <h4 className="mb-4 text-xl font-semibold">Template</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between ">
              <div className="flex flex-col p-0">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center gap-x-4 p-0">
                      <FormLabel className="w-full  font-normal">
                        Name Template
                      </FormLabel>
                      <Input
                        className="h-auto w-full min-w-[200px] border font-normal ring-0"
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center gap-x-4 p-0">
                      <FormLabel className="w-full font-normal">
                        Description
                      </FormLabel>
                      <Input
                        className="h-auto min-w-[200px] border font-normal ring-0"
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-fit gap-x-4">
                <VideoRecord videoUrl={introVideoUrl} type="intro" />
                <div className="flex flex-col">
                  <div className="item-center flex gap-x-2">
                    <Video />
                    <h3 className="text-2xl font-semibold"> Intro Video</h3>
                  </div>
                  <p className="text-sm font-normal text-slate-400">
                    There is automatic has been created.
                  </p>
                  <FormField
                    control={form.control}
                    name="descriptionIntro"
                    render={({ field }) => (
                      <FormItem className="flex w-full items-center gap-x-4 p-0">
                        <Input
                          className="h-auto min-w-[392px] border font-normal ring-0"
                          onChange={field.onChange}
                          placeholder="Greeting Message"
                          value={field.value}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="my-4">
              <h4 className="text-xl font-semibold">Time</h4>
              <div className="mt-2 flex gap-x-4">
                <FormField
                  control={form.control}
                  name="durationTimeRead"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex items-center gap-x-2 p-0">
                      <FormLabel className="w-fit text-xs">
                        Time to Thinking:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-36">
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs">
                          <SelectItem value="0">none</SelectItem>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minutes</SelectItem>
                          <SelectItem value="120">2 minutes</SelectItem>
                          <SelectItem value="180">3 minutes</SelectItem>
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
                    <FormItem className="flex items-center gap-x-2 p-0">
                      <FormLabel className="w-fit text-xs">
                        Time to Answer:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-36">
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs">
                          <SelectItem value="60">1 minutes</SelectItem>
                          <SelectItem value="120">2 minutes</SelectItem>
                          <SelectItem value="180">3 minutes</SelectItem>
                          <SelectItem value="240">4 minutes</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {Array.isArray(questions) &&
              questions.map((item, index) => (
                <QuestionCard
                  key={index}
                  idx={index}
                  question={item.question}
                  title={item.title}
                  type="questions"
                />
              ))}
            <div className="my-4">
              <div className="flex items-center justify-between">
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
                  Save Template
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default FormTemplate;
