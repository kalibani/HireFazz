'use client';

import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '../ui/input';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import TableInvite from './Table-invite';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

const CandidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
const FormSchema = z.object({
  title: z.string().min(2),
  candidates: z.array(CandidateSchema),
});

const InviteCandidates = ({ orgId }: { orgId: string }) => {
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

  const [importedCandidates, setImportedCandidates] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const parsedData = (
      data.candidates as z.infer<typeof CandidateSchema>[]
    ).map((item) => ({
      id: uuidv4(),
      name: item.name,
      email: item.email,
    }));
    const allCandidates = [...parsedData, ...importedCandidates];
    setTitle(data.title);
    setImportedCandidates(allCandidates);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const parsedData = (
            results.data as z.infer<typeof CandidateSchema>[]
          ).map((item) => ({
            id: uuidv4(),
            name: item.name,
            email: item.email,
          }));
          const allCandidates = [...parsedData, ...importedCandidates];
          setImportedCandidates(allCandidates);
        },
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href =
      'https://utfs.io/f/77d6ec9e-d673-418c-bdfc-1b630ae4271c-1v55sg.csv';
    link.download = 'candidates.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const invitedHandler = () => {
    if (importedCandidates && title && orgId) {
      console.log('Send >>>>', {
        importedCandidates,
        title,
        orgId,
      });
    }
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
                <div className="flex  w-1/2  gap-x-2" key={field.id}>
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
                  <div className=" flex items-end justify-end ">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      variant="ghost"
                      className={cn(
                        fields.length === 1 && 'cursor-not-allowed',
                      )}
                    >
                      <Trash2 className="size-4 text-primary" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => append({ name: '', email: '' })}
                    >
                      <PlusCircle className="size-4 text-primary" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="space-x-2">
                <Button type="submit">Invite</Button>
                <Button type="button" variant="ghost">
                  <label className="cursor-pointer">
                    Import file
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </Button>
                <Button type="button" onClick={handleDownload} variant="ghost">
                  Download CSV
                </Button>
              </div>
            </div>
          </form>
        </div>
        <TableInvite dataSource={importedCandidates} />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={importedCandidates.length === 0}
          onClick={invitedHandler}
        >
          Next Step
        </Button>
      </div>
    </Form>
  );
};

export default InviteCandidates;
