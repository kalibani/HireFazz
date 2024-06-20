'use client';

import { Trash2, Settings, FileSpreadsheet, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useRecorderStore } from '@/zustand/recordedStore';
import VideoRecord from './video-record';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';

const FormSchema = z.object({
  timeRead: z.string().optional(),
  title: z.string(),
  question: z.string(),
  timeAnswered: z.string().optional(),
});
type TFormSchema = z.input<typeof FormSchema>;

const FormQuestion = () => {
  const [isSettings, setIsSettings] = useState<boolean>(false);

  const {
    setQuestion,
    setVideoUrl,
    questions,
    questionForm,
    questionVideoUrl,
    durationTimeAnswered,
    durationTimeRead,
    setIsAddQuestion,
  } = useRecorderStore();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: '',
      timeAnswered: '',
      timeRead: '',
      title: '',
    },
  });

  useEffect(() => {
    if (!!questionForm?.id) {
      setVideoUrl(questionForm.videoUrl || null, 'question');
      form.setValue('title', questionForm.title);
      form.setValue('question', questionForm.question || '');
      form.setValue('timeAnswered', String(questionForm.timeAnswered) || '');
      form.setValue('timeRead', String(questionForm.timeRead) || '');
    } else {
      setVideoUrl(null, 'question');
    }
  }, [form, questionForm, setVideoUrl]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!!questionForm?.id) {
      const payload = {
        id: questionForm.id,
        title: data.title,
        question: data.question,
        timeAnswered: Number(data.timeAnswered) || 0,
        timeRead: Number(data.timeRead) || 0,
        videoUrl: questionVideoUrl,
        idx: questionForm.idx,
      };
      setQuestion(payload);
    } else {
      setQuestion({
        id: uuidv4(),
        title: data.title,
        question: data.question,
        timeAnswered: Number(data.timeAnswered) ?? durationTimeAnswered,
        timeRead: Number(data.timeRead) ?? durationTimeRead,
        videoUrl: questionVideoUrl,
      });
    }
    setIsAddQuestion(false);
  };

  const closeHandler = () => {
    setIsAddQuestion(false);
  };

  return (
    <div className=" rounded-md bg-white p-4">
      <Form {...form}>
        <div className="flex gap-x-4">
          <VideoRecord
            videoUrl={questionVideoUrl}
            type="question"
            className="w-1/4"
          />
          <div className="flex-1 gap-y-4">
            <div className="flex items-center gap-x-2">
              <FileSpreadsheet className="size-4 text-primary" />
              <h4 className="text-xl font-semibold">
                Question #
                {!!questionForm?.title
                  ? (questionForm?.idx as number) + 1
                  : (questions.length ?? 0) + 1}
              </h4>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="text-xs">
                    Title Question
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex items-center gap-x-4">
                    <Input placeholder="" {...field} className="w-full" />
                    <div className="flex flex-col gap-y-6">
                      <Button
                        variant="ghost"
                        className="h-0 p-0 hover:bg-transparent"
                        onClick={() => setIsSettings(!isSettings)}
                        type="button"
                      >
                        <Settings className="size-5 text-primary" />
                      </Button>
                    </div>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="mt-4 space-y-0">
                  <FormLabel className="text-xs">
                    Question
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Textarea placeholder="" {...field} minRows={2.5} />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {isSettings && (
              <div className="mt-4 flex gap-4">
                <FormField
                  control={form.control}
                  name="timeRead"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-xs capitalize">
                        Time to Thinking
                      </FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          <SelectItem value="0">none</SelectItem>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minutes</SelectItem>
                          <SelectItem value="120">2 minutes</SelectItem>
                          <SelectItem value="180">3 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeAnswered"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-xs">Time to Answare</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
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
            )}
          </div>
        </div>
        <div className="my-4 flex w-full justify-between">
          <Button
            className="text-sm font-normal"
            variant="secondary"
            onClick={closeHandler}
            type="button"
          >
            close
          </Button>
          <Button
            className="gap-2 px-4 py-2 text-sm font-normal"
            type="button"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Save className="size-4" />
            Add Question
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormQuestion;
