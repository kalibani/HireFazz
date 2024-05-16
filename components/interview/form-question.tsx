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
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const FormSchema = z.object({
  timeRead: z.string().optional(),
  title: z.string(),
  question: z.string(),
  timeAnswered: z.string().optional(),
});

const FormQuestion = () => {
  const { back } = useRouter();
  const queryParams = useSearchParams();

  const [isSettings, setIsSettings] = useState<boolean>(false);
  const {
    setQuestion,
    setVideoUrl,
    questions,
    questionVideoUrl,
    durationTimeAnswered,
    durationTimeRead,
  } = useRecorderStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    setVideoUrl(null, 'question');
  }, []);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setQuestion({
      title: data.title,
      question: data.question,
      timeAnswered: Number(data.timeAnswered) ?? durationTimeAnswered,
      timeRead: Number(data.timeRead) ?? durationTimeRead,
      videoUrl: questionVideoUrl,
    });
    back();
  };

  return (
    <div className="rounded-md bg-white p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-x-4">
            <VideoRecord videoUrl={questionVideoUrl} type="question" />
            <div className="flex-1 gap-y-4">
              <div className="flex items-center gap-x-2">
                <FileSpreadsheet className="size-4 text-primary" />
                <h4 className="text-xl font-semibold">
                  Question #{questions.length + 1}
                </h4>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormLabel className="text-xs">Title Question</FormLabel>
                    <div className="flex items-center gap-x-4">
                      <FormControl>
                        <Input placeholder="" {...field} className="w-full" />
                      </FormControl>
                      <div className="flex flex-col gap-y-6">
                        <Button
                          variant="ghost"
                          className="h-0 p-0 hover:bg-transparent"
                        >
                          <Trash2 className="size-3 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-0 p-0 hover:bg-transparent"
                          onClick={() => setIsSettings(!isSettings)}
                        >
                          <Settings className="size-3 text-primary" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSettings && (
                <div className="flex gap-x-4">
                  <FormField
                    control={form.control}
                    name="timeRead"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="text-xs capitalize">
                          Candidate Thinking Time
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
                    name="timeAnswered"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="text-xs">
                          Candidtae Max Answer length per Question
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
              )}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="mt-4 space-y-0">
                    <FormLabel className="text-xs">Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} minRows={2.5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="my-4 flex w-full justify-between">
            <Button
              className="text-sm font-normal"
              variant="secondary"
              onClick={() => back()}
              type="button"
            >
              Go Back
            </Button>
            <Button
              className="gap-2 px-4 py-2 text-sm font-normal"
              type="submit"
            >
              <Save className="size-4" />
              Add Question
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormQuestion;
