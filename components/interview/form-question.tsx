'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2, FilePlus2, FileSpreadsheet } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRecorderStore } from '@/zustand/recordedStore';
import VideoRecord from './video-record';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';

const FormSchema = z.object({
  timeRead: z.string().optional(),
  title: z.string(),
  question: z.string(),
  timeAnswered: z.string().optional(),
});

const FormQuestion = () => {
  const { setQuestion, addQuestion, removeQuestion, questions } =
    useRecorderStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submit here
  };
  return (
    <div className="rounded-md bg-white p-4">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-x-4">
            <VideoRecord videoUrl={null} />
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
                  <FormItem>
                    <FormLabel className="text-xs">Title Question</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
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
        </form>
      </Form>
    </div>
  );
};

export default FormQuestion;
