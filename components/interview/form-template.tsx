'use client';
import React, { useEffect, useTransition } from 'react';
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
        <h3 className="mb-2 text-xl font-semibold">Intro Video</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-x-4">
              <VideoRecord videoUrl={introVideoUrl} type="intro" />
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
                    type="button"
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
                    Save Template
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
        {Array.isArray(questions) &&
          questions.map((item, index) => (
            <QuestionCard
              key={index}
              idx={index}
              question={item.question}
              title={item.title}
            />
          ))}
      </div>
    </>
  );
};

export default FormTemplate;
