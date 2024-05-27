'use client';

import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '../ui/input';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import TableInvite from './Table-invite';

const FormSchema = z.object({
  title: z.string(),
  candidates: z.array(
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ),
});

const InviteCandidates = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      candidates: [{ name: '', email: '' }],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'candidates',
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data, '<<<<');
  };
  return (
    <Form {...form}>
      <div className="rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">Create Interview Candidates</h3>
        <div className="mt-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-1/4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="m-0  w-full font-normal">
                      Name Interview
                    </FormLabel>
                    <Input
                      className="h-auto w-full min-w-[200px] border font-normal ring-0"
                      {...field}
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="mt-5">
            <h4 className="text-xl font-semibold">Notification</h4>
            <div className="felx-col my-4 flex items-center gap-x-4 text-sm">
              <p>Send by Email</p>
              <Button className="gap-x-1">
                <Pencil className="size-4" />
                emplate Email
              </Button>
            </div>
          </div> */}

            <h4 className="my-4 text-xl font-semibold">Invites Candidates</h4>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div className="flex w-1/2 items-end gap-x-2" key={field.id}>
                  <FormField
                    control={form.control}
                    name={`candidates.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel className="m-0 font-normal">
                          Full Name
                        </FormLabel>
                        <Input
                          className="h-auto border font-normal ring-0"
                          {...field}
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`candidates.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel className="m-0 font-normal">
                          Email{' '}
                        </FormLabel>
                        <Input
                          type="email"
                          className="h-auto border font-normal ring-0"
                          {...field}
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ name: '', email: '' })}
              >
                Add New Form Candidates
              </Button>
              <div>
                <Button type="submit">Invite</Button>
              </div>
            </div>
          </form>
        </div>
        <TableInvite />
      </div>
      <div className="flex justify-end">
        <Button>Next Step</Button>
      </div>
    </Form>
  );
};

export default InviteCandidates;
