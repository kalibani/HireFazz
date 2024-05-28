'use client';

import React, { useMemo, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
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
import { TInterview } from '@/lib/validators/interview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '../ui/select';
import { LINK_TEMPLATE_CSV } from '@/constant';
import QuestionCard from './question-card';

const CandidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
const FormSchema = z.object({
  title: z.string().min(2),
  template: z.string(),
  candidates: z.array(CandidateSchema),
});

const InviteCandidates = ({
  orgId,
  interviews,
}: {
  orgId: string;
  interviews: TInterview[];
}) => {
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

  const watchTemplate = form.watch('template');

  const selectedTemplate = useMemo(() => {
    const selectedCard = interviews.filter((item) => item.id === watchTemplate);
    return selectedCard[0];
  }, [watchTemplate, interviews]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data, '<<<<');
    if (data.candidates) {
      const parsedData = (
        data.candidates as z.infer<typeof CandidateSchema>[]
      ).map((item) => ({
        id: uuidv4(),
        name: item.name,
        email: item.email,
      }));
      const allCandidates = importedCandidates.map((imported) => {
        const existingIndex = parsedData.findIndex(
          (p) => p.email === imported.emai,
        );
        if (existingIndex !== -1) {
          return parsedData[existingIndex];
        }
        return imported;
      });
      const newCandidates = parsedData.filter(
        (p) => !importedCandidates.some((i) => i.email !== p.email),
      );
      const finalCandidates = [...allCandidates, ...newCandidates];

      setTitle(data.title);
      setImportedCandidates(finalCandidates);
    }
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
    link.href = LINK_TEMPLATE_CSV;
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
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="rounded-md bg-white p-4">
        <h3 className="text-2xl font-semibold">Create Interview Candidates</h3>
        <div className="mt-4 ">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full gap-x-2 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormLabel className="m-0 w-full font-normal">
                      Name Interview
                    </FormLabel>
                    <Input
                      className="h-auto w-full border font-normal ring-0"
                      {...field}
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormLabel className="m-0  w-full font-normal">
                      Select Template question
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {interviews.length > 0 &&
                          interviews?.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.title}
                            </SelectItem>
                          ))}
                        {interviews.length === 0 && (
                          <div className="flex flex-col justify-center gap-y-1 p-1 text-sm">
                            <p>you don't have template</p>
                            <Button className="h-auto p-1">
                              Create Template
                            </Button>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {watchTemplate && (
              <QuestionCard
                key={selectedTemplate.id}
                title={selectedTemplate.title}
                id={selectedTemplate.id}
                question={selectedTemplate.description!}
                type="template"
                dataSource={selectedTemplate}
              />
            )}

            <h4 className="my-4 text-xl font-semibold">Invites Candidates</h4>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div className="flex  w-full  gap-x-2" key={field.id}>
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
                        <div className="flex gap-x-2">
                          <Input
                            type="email"
                            className="h-auto border font-normal ring-0"
                            {...field}
                          />
                          <div className="flex items-center gap-x-1">
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                              variant="ghost"
                              className={cn(
                                'h-auto p-1',
                                fields.length === 1 && 'cursor-not-allowed',
                              )}
                            >
                              <Trash2 className="size-4 text-primary" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => append({ name: '', email: '' })}
                              className="h-auto p-1"
                            >
                              <PlusCircle className="size-4 text-primary" />
                            </Button>
                          </div>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {/* <div className=" flex items-end justify-end ">
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
                      className="h-auto p-1"
                    >
                      <PlusCircle className="size-4 text-primary" />
                    </Button>
                  </div> */}
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
              </div>
            </div>
          </form>
        </div>
        <div className=" my-4 items-center gap-x-2 rounded-md bg-yellow-100 p-2 text-center text-sm italic">
          <p>
            Click the link bellow to download the template file and get started
            easily.
          </p>
          <Button
            type="button"
            onClick={handleDownload}
            variant="link"
            className="h-0 p-0"
          >
            Download CSV
          </Button>
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
