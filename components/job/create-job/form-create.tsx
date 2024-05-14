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
import { removeNonDigit, separateThousand } from '@/lib/utils';
import { WORK_MODEL } from '@prisma/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


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
    <div className="flex flex-1 overflow-y-scroll w-full flex-col items-center rounded-md bg-white  py-8">
      <div className="w-1/2">
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
                      placeholder="Location"
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

            <div className="flex w-full items-start justify-between gap-x-4">
              <FormField
                control={form.control}
                name="experiences"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-sm font-normal">
                      Minimum Experience (years)
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
                        {Array.from(Array(21).keys()).map((item) => <SelectItem value={item.toString()} key={item}>{item} {item < 2 ? 'year' : 'years'}</SelectItem>)}
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
                    <FormControl>
                        <RadioGroup
                          orientation="horizontal"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3"
                        >
                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.ONSITE} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              On-site
                            </span>
                          </FormItem>

                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.REMOTE} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Remote
                            </span>
                          </FormItem>
            
                          <FormItem className="flex items-center justify-start gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.HYBRID} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Hybrid
                            </span>
                          </FormItem>
                         
                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.PART_TIME} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Part-time
                            </span>
                          </FormItem>

                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.FREELANCE} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Freelance
                            </span>
                          </FormItem>

                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.CONTRACT} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Contract
                            </span>
                          </FormItem>

                          <FormItem className="flex items-center gap-x-2 flex-1">
                            <FormControl>
                              <RadioGroupItem value={WORK_MODEL.INTERNSHIP} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Internship
                            </span>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
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
