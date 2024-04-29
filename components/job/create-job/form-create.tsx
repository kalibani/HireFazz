'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useFormStepStore } from '@/zustand/useCreateJob';
import { formSchemaCreateJob } from '@/lib/validators/createJob';
import { removeNonDigit, separateThousand } from '@/helpers';


const FormCreate = () => {
  const { setStep, setFormCreateJob } = useFormStepStore((state) => state);
  const form = useForm<z.infer<typeof formSchemaCreateJob>>({
    resolver: zodResolver(formSchemaCreateJob),
    defaultValues: {
      title: '',
      companyName: '',
      workModel: 'REMOTE',
      currency: 'IDR',
      experiences: '0',
      fromNominal: '',
      toNominal: '',
      location: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchemaCreateJob>) => {
    // remove separator for submit form
    if (values.fromNominal) {
      values.fromNominal =  removeNonDigit(values.fromNominal)
    }
    if (values.toNominal) {
      values.toNominal =  removeNonDigit(values.toNominal)
    }
  
    setStep(1);
    setFormCreateJob(values);
  };

  const onSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: ControllerRenderProps['onChange']) => {
    const formatted = separateThousand(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center rounded-md bg-white  py-8">
      <div className="w-1/2">
        <h3 className="text-center text-2xl font-semibold">Create New Job</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-10  w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Title *</FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder="Job title"
                      {...field}
                      className="h-auto w-full text-sm "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Location *
                  </FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder="Location Applicant"
                      {...field}
                      className="h-auto w-full text-sm "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-end justify-between">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Average Salary (per month)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IDR">IDR</SelectItem>
                        <SelectItem value="US">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromNominal"
                render={({ field }) => (
                  <FormItem className="w-60">
                    <FormLabel className="text-sm font-normal">
                      (optional)
                    </FormLabel>
                    <FormControl className="tex-slate-400">
                      <Input
                        placeholder="From"
                        {...field}
                        onChange={(e) => onSalaryInputChange(e, field.onChange)}
                        className="h-auto w-full text-sm "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toNominal"
                render={({ field }) => (
                  <FormItem className="w-60">
                    <FormLabel className="text-sm font-normal"></FormLabel>
                    <FormControl className="tex-slate-400">
                      <Input
                        placeholder="To"
                        {...field}
                        onChange={(e) => onSalaryInputChange(e, field.onChange)}
                        className="h-auto w-full text-sm "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full items-end justify-between gap-x-4">
              <FormField
                control={form.control}
                name="experiences"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal">
                      Average Salary (per month)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 year</SelectItem>
                        <SelectItem value="1">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workModel"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal">
                      Work Model
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONSITE">On Site</SelectItem>
                        <SelectItem value="REMOTE">Remote</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Company Name
                  </FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className="h-auto w-full text-sm "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FormCreate;
