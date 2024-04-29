'use client';
import React from 'react';
import { Button } from '../ui/button';
import VideoRecord from './video-record';
import { useRecorderStore } from '@/zustand/recordedStore';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const FormSchema = z.object({
  timeRead: z.string(),
  title: z.string(),
  timeAnswered: z.string(),
  videoUrl: z.any(),
  question: z.string(),
});

const CreateQuestionInterview = () => {
  const { questions, removeQuestion, addQuestion } = useRecorderStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const addQuestionHandler = () => {};
  console.log(questions, '?');
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-md bg-white  p-4">
      {questions?.map((question, index) => (
        <div
          className="flex w-full gap-x-4 rounded-md border p-8 shadow"
          key={index}
        >
          <VideoRecord videoUrl={null} />
          <div className="flex w-full flex-col gap-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Input placeholder="Question Titile" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        placeholder="Question Description"
                        className="placeholder:text-slate-400"
                        minRows={4}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end gap-x-4">
                  <FormField
                    control={form.control}
                    name="timeRead"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          CANDIDATE THINKING TIME
                        </FormLabel>
                        <Select {...field}>
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
                    name="timeRead"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          CANDIDATE MAX ANSWER LENGTH PER QUESTION
                        </FormLabel>
                        <Select {...field}>
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
                  <Button type="submit">Save</Button>
                  {questions.length > 1 && (
                    <Button onClick={() => removeQuestion(0)}>Delete</Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      ))}
      <Button className="w-full" onClick={addQuestion}>
        Add Questions
      </Button>
    </div>
  );
};

export default CreateQuestionInterview;
