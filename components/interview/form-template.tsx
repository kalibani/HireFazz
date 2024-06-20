'use client';
import React, { useCallback, useEffect, useTransition } from 'react';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Button } from '../ui/button';
import { Save, Video } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from '@/components/share';

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

import { errorHandler } from '@/helpers';
import { uploadVideo } from '@/lib/actions/interview/uploadVideo';
import { blobToFormData } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import FormQuestion from './form-question';
import updateTemplateInterview from '@/lib/actions/interview/updateTemplateInterview';
import createTemplateInterview from '@/lib/actions/interview/createTemplateInterview';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';

const FormSchema = z.object({
  durationTimeRead: z.string({ message: 'select your duration time' }),
  title: z.string().min(2, { message: 'Input name Template' }),
  durationTimeAnswered: z.string({ message: 'select your duration time' }),
  description: z.string().optional(),
  descriptionIntro: z.string().optional(),
});

const FormTemplate = ({
  orgId,
  queryId,
  dataTemplate,
}: {
  orgId: string;
  queryId?: string;
  dataTemplate?: any;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      durationTimeAnswered: '',
      durationTimeRead: '',
      title: '',
      description: '',
      descriptionIntro: '',
    },
  });

  const { replace } = useRouter();

  const {
    introVideoUrl,
    questions,
    setQuestionFromDb,
    setVideoUrl,
    isAddQuestion,
    setIsAddQuestion,
    setQuestionForm,
  } = useRecorderStore();
  const [isPending, startTransition] = useTransition();

  const templateHandler = useCallback(
    async (payload: any, id?: string) => {
      try {
        if (id) {
          const updatedData = await updateTemplateInterview({ ...payload, id });
          updatedData && toast.success(updatedData?.success);
        } else {
          const createdData = await createTemplateInterview(payload);
          //@ts-ignore
          createdData && toast.success(createdData?.success);
        }
      } catch (error) {
        //@ts-ignore
        toast.error(error.message);
      } finally {
        replace(`/${orgId}/video?tab=template`);
      }
    },
    [orgId, replace],
  );

  useEffect(() => {
    form.reset();

    if (dataTemplate && orgId) {
      const {
        title,
        description,
        descriptionIntro,
        durationTimeRead,
        durationTimeAnswered,
        introVideoUrl,
      } = dataTemplate;
      setQuestionFromDb(dataTemplate.questions);
      setVideoUrl(introVideoUrl, 'intro');
      form.setValue('title', title);
      form.setValue('description', description || '');
      form.setValue('descriptionIntro', descriptionIntro || '');
      form.setValue('durationTimeRead', durationTimeRead.toString());
      form.setValue(
        'durationTimeAnswered',
        durationTimeAnswered.toString() || '',
      );
    } else {
      setQuestionFromDb([]);
      setVideoUrl('', 'intro');
    }
  }, [dataTemplate, form, setQuestionFromDb, setVideoUrl, orgId]);

  const handleAddQuestion = () => {
    setQuestionForm({
      videoUrl: '',
      id: '',
      title: '',
      question: '',
    });
    setIsAddQuestion(true);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const {
      title,
      durationTimeAnswered,
      durationTimeRead,
      description,
      descriptionIntro,
    } = data;
    if (questions.length > 0) {
      startTransition(async () => {
        try {
          const resolvedQuestions = await Promise.all(
            questions.map(async (item) => {
              let url = '';
              if (item.videoUrl) {
                const urlFormData = await blobToFormData(
                  item.videoUrl,
                  'questions',
                );
                if (typeof urlFormData !== 'string') {
                  url = (await uploadVideo(urlFormData)) as string;
                } else {
                  url = urlFormData;
                }
              }
              return {
                ...item,
                // id: uuidv4(),
                timeAnswered: Number(item.timeAnswered || durationTimeAnswered),
                timeRead: Number(item.timeRead || durationTimeRead),
                videoUrl: url,
                questionRetake: 0,
              };
            }),
          );

          let introUrl = '';
          if (introVideoUrl) {
            const introVideo = await blobToFormData(introVideoUrl, 'intro');
            if (typeof introVideo !== 'string') {
              introUrl = (await uploadVideo(introVideo)) as string;
            } else {
              introUrl = introVideo;
            }
          }
          const payload: any = {
            organizationId: orgId,
            title,
            durationTimeAnswered: Number(durationTimeAnswered),
            durationTimeRead: Number(durationTimeRead),
            introVideoUrl: introUrl,
            questions: resolvedQuestions,
            description,
            descriptionIntro,
          };

          templateHandler(payload, queryId);
        } catch (error) {
          errorHandler(error);
        }
      });
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="rounded-md bg-white p-4">
            <h4 className="mb-4 text-xl font-semibold">Template</h4>
            <div className="flex items-center justify-between gap-x-10 ">
              <div className="flex w-1/2 flex-col gap-y-4 p-0">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="m-0  w-full font-normal">
                        Name Template{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-auto w-full border font-normal ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="w-full font-normal">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          minRows={5}
                          className="h-auto w-full border font-normal ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex h-full w-1/2 items-center gap-x-4">
                <VideoRecord
                  videoUrl={introVideoUrl}
                  type="intro"
                  className="w-1/2"
                />
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
                      <FormItem className="flex w-1/2 items-center gap-x-4 p-0">
                        <Textarea
                          className="h-auto min-w-[392px] border font-normal ring-0"
                          minRows={5}
                          placeholder="Greeting Message"
                          {...field}
                        />
                        <FormMessage className="text-xs" />
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
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="w-fit text-xs">
                        Time to Thinking{' '}
                        <span className="text-destructive">*</span>{' '}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value || String(dataTemplate?.durationTimeRead)
                        }
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

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationTimeAnswered"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="w-fit text-xs">
                        Time to Answer{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          field.value ||
                          String(dataTemplate?.durationTimeAnswered)
                        }
                      >
                        <FormControl className="w-36">
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-xs">
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="120">2 minutes</SelectItem>
                          <SelectItem value="180">3 minutes</SelectItem>
                          <SelectItem value="240">4 minutes</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md bg-white p-4">
            {isAddQuestion && (
              <div className="my-4">
                <h4 className="text-xl font-semibold">Add Question</h4>
                <FormQuestion />
              </div>
            )}

            <div className="my-4">
              <h4 className="text-xl font-semibold">Questions</h4>
              {questions.length > 0 ? (
                questions.map((item, index) => (
                  <QuestionCard
                    key={index}
                    idx={index}
                    question={item.question}
                    title={item.title}
                    id={item.id}
                    videoUrl={item.videoUrl}
                    timeAnswered={item?.timeAnswered || 0}
                    timeRead={item?.timeRead || 0}
                    // videoUrl={
                    //   typeof item.videoUrl === 'string'
                    //     ? item.videoUrl
                    //     : undefined
                    // }
                    type="questions"
                    dataSource={dataTemplate}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <p>No Question</p>
                  <Button type="button" onClick={handleAddQuestion}>
                    + Add Question
                  </Button>
                </div>
              )}
            </div>
            {questions.length > 0 && (
              <div className="my-3">
                <Button
                  className=" text-sm font-normal text-black"
                  variant="outline"
                  type="button"
                  onClick={handleAddQuestion}
                >
                  + Add Question
                </Button>
              </div>
            )}
          </div>
          <div className="my-3 flex w-full justify-end">
            <Button
              className="gap-2 px-4 py-2 text-sm font-normal"
              type="submit"
              disabled={questions?.length === 0}
            >
              <Save className="size-4" />
              Save Template
            </Button>
          </div>
        </form>
      </Form>

      {isPending && (
        <div className="fixed left-0 top-0 z-50 h-full w-full items-start justify-center rounded-lg bg-black bg-opacity-40">
          <Loader />
        </div>
      )}
    </>
  );
};

export default FormTemplate;
