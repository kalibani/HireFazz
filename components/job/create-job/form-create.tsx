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
import { FormSchemaCreateJob, getFormSchemaCreateJob } from '@/lib/validators/createJob';
import { removeNonDigit, separateThousand } from '@/lib/utils';
import { WORK_MODEL } from '@prisma/client';
import { useTranslations } from 'next-intl';

const FormCreate = () => {
  const { setStep, setFormCreateJob, dataCreateJob } = useFormStepStore((state) => state);
  const t = useTranslations('CreateJob')
  const formSchemaCreateJob = getFormSchemaCreateJob(t)
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
    values: dataCreateJob,
  });

  const onSubmit = (values: z.infer<FormSchemaCreateJob>) => {
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
      <div className="w-1/2 h-full ">
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
                  <FormLabel className="text-sm font-normal">{t('form_jobTitle')} *</FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder={t('form_job')}
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
                    {t('form_location')} *
                  </FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder={t('form_candidateLocation')}
                      {...field}
                      className="h-auto w-full text-sm "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-end gap-5">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      {t('form_monthlySalary')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={dataCreateJob.currency || field.value}
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-normal">
                      {t('form_optional')}
                    </FormLabel>
                    <FormControl className="tex-slate-400">
                      <Input
                        placeholder={t('form_startFrom')}
                        {...field}
                        onChange={(e) => onSalaryInputChange(e, field.onChange)}
                        className="h-auto w-full text-sm "
                        value={field.value ? separateThousand(field.value) : undefined}
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
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-normal"></FormLabel>
                    <FormControl className="tex-slate-400">
                      <Input
                        placeholder={t('form_endTo')}
                        {...field}
                        onChange={(e) => onSalaryInputChange(e, field.onChange)}
                        className="h-auto w-full text-sm "
                        value={field.value ? separateThousand(field.value) : undefined}
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
                      {t('form_experience')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={dataCreateJob.experiences || field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(Array(21).keys()).map((item) => <SelectItem value={item.toString()} key={item}>{item} {t('year')}</SelectItem>)}
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
                      {t('form_jobType')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={dataCreateJob.workModel || field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a work model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={WORK_MODEL.ONSITE}>{t('jobTypeOnSite')}</SelectItem>
                        <SelectItem value={WORK_MODEL.REMOTE}>{t('jobTypeRemote')}</SelectItem>
                        <SelectItem value={WORK_MODEL.HYBRID}>{t('jobTypeHybrid')}</SelectItem>
                        <SelectItem value={WORK_MODEL.PART_TIME}>{t('jobTypePartTime')}</SelectItem>
                        <SelectItem value={WORK_MODEL.FREELANCE}>{t('jobTypeFreelance')}</SelectItem>
                        <SelectItem value={WORK_MODEL.CONTRACT}>{t('jobTypeContract')}</SelectItem>
                        <SelectItem value={WORK_MODEL.INTERNSHIP}>{t('jobTypeIntern')}</SelectItem>
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
                    {t('form_company')}
                  </FormLabel>
                  <FormControl className="tex-slate-400">
                    <Input
                      placeholder={t('form_company')}
                      {...field}
                      className="h-auto w-full text-sm "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">{t('cta_next')}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FormCreate;
