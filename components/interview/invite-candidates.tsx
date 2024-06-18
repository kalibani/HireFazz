'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
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
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import TableInvite from './Table-invite';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import { TDetailCandidate, TInterview } from '@/lib/validators/interview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../ui/select';
import { LINK_TEMPLATE_CSV } from '@/constant';
import QuestionCard from './question-card';
import createInviteCandidates from '@/lib/actions/interview/inviteCandidates';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '../share';

import PopUpImportChecker from './popup-import-email';
import toast from 'react-hot-toast';

export const CandidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  id: z.string(),
});

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Please input the interview name',
  }),
  template: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  companyName: z.string().min(2, {
    message: 'Please input the company name',
  }),
});

type Candidate = z.infer<typeof CandidateSchema>;

const mergeCandidates = (
  newCandidates: Candidate[],
  existingCandidates: Candidate[],
): Candidate[] => {
  const finalCandidates = existingCandidates.filter(
    (imported) =>
      !newCandidates.some((candidate) => candidate.email === imported.email),
  );

  return [...finalCandidates, ...newCandidates];
};

const InviteCandidates = ({
  orgId,
  interviews,
  candidate,
}: {
  orgId: string;
  interviews: TInterview[];
  candidate: TDetailCandidate;
}) => {
  const [editData, setEditData] = useState<{
    name: string;
    templateId: string;
    companyName?: string;
  }>();
  const searchParam = useSearchParams();
  const id = searchParam.get('idInvite');
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [importedCandidates, setImportedCandidates] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [invalidData, setInvalidData] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      template: '',
      title: '',
      companyName: '',
    },
    values: {
      title: editData?.name || '',
      template: editData?.templateId || '',
      companyName: editData?.companyName || '',
    },
  });

  const watchTemplate = form.watch('template');

  useEffect(() => {
    form.reset();
    if (id && candidate) {
      setEditData(candidate);
    }
  }, [id, form, candidate]);

  const selectedTemplate = useMemo(() => {
    const selectedCard = interviews.filter((item) => item.id === watchTemplate);
    return selectedCard[0];
  }, [watchTemplate, interviews]);

  const addNameEmail = () => {
    const name = form.getValues('name');
    const email = form.getValues('email');
    if (!!email && !!name) {
      const parsedData = { id: uuidv4(), name, email };

      setImportedCandidates((prevCandidates) => [
        ...prevCandidates,
        parsedData,
      ]);
      form.resetField('name');
      form.resetField('email');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addNameEmail();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const validCandidates: any[] = [];
          const invalidCandidates: any[] = [];

          (results.data as z.infer<typeof CandidateSchema>[]).forEach(
            (item) => {
              if (
                CandidateSchema.pick({ email: true }).safeParse(item).success
              ) {
                validCandidates.push({ ...item, id: uuidv4() });
              } else {
                invalidCandidates.push({ ...item, id: uuidv4() });
              }
            },
          );

          const finalCandidates = mergeCandidates(
            validCandidates,
            importedCandidates,
          );
          setImportedCandidates(finalCandidates);
          if (invalidCandidates.length > 0) {
            setInvalidData(invalidCandidates);
            setIsOpen(true);
          }

          // Clear the input value to allow re-selection of the same file
          fileInput.value = '';
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

  const invitedHandler = (data: z.infer<typeof FormSchema>) => {
    if ((!data.email || !data.name) && importedCandidates.length === 0) {
      form.setError('email', { message: 'Input your valid email' });
      form.setError('name', { message: 'Input your valid email' });
    }

    if (!selectedTemplate && !watchTemplate) {
      form.setError('template', { message: 'Select or create your template' });
    } else {
      form.clearErrors();
      const validCandidates: any[] = [];
      const invalidCandidates: any[] = [];
      (importedCandidates as z.infer<typeof CandidateSchema>[]).forEach(
        (item) => {
          if (CandidateSchema.safeParse(item).success) {
            validCandidates.push({ ...item });
          } else {
            invalidCandidates.push({ ...item });
          }
        },
      );
      const finalCandidates = mergeCandidates(
        validCandidates,
        importedCandidates,
      );
      setImportedCandidates(finalCandidates);
      if (invalidCandidates.length > 0) {
        setInvalidData(invalidCandidates);
        setIsOpen(true);
      } else {
        startTransition(() => {
          const payload = {
            importedCandidates,
            title: data.title,
            orgId,
            templateId: selectedTemplate?.id,
            interviewCandidateId: id || '',
            companyName: data.companyName,
          };
          createInviteCandidates(payload)
            .then(async (data) => toast.success(data?.success || 'success'))
            .catch((error) => toast.error(error))
            .finally(() => {
              push(`/${orgId}/video?tab=candidates`);
            });
        });
      }
    }
  };
  const handleFormSubmit = (updatedData: any) => {
    const validCandidates: any[] = [];
    const invalidCandidates: any[] = [];

    updatedData.forEach((item: any) => {
      if (CandidateSchema.safeParse(item).success) {
        validCandidates.push({ ...item });
      } else {
        invalidCandidates.push({ ...item });
      }
    });

    const existing = importedCandidates.filter((imported) =>
      validCandidates.some((valid) => imported.id !== valid.id),
    );
    setImportedCandidates([...existing, ...validCandidates]);
    if (invalidCandidates.length > 0) {
      setInvalidData(invalidCandidates);
      setIsOpen(true);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(invitedHandler)}>
          <div className="rounded-md bg-white p-4">
            <h3 className="text-2xl font-semibold">
              {id ? 'Edit ' : 'Create '}Interview Candidates
            </h3>
            <div className="mt-4 ">
              <div className="flex w-full gap-x-2 ">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="m-0 w-full font-normal">
                        Name Interview
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Input
                        className="h-auto w-full border font-normal ring-0"
                        disabled={!!candidate && !!id}
                        {...field}
                      />
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="m-0 w-full font-normal">
                        Company Name<span className="text-destructive">*</span>
                      </FormLabel>
                      <Input
                        className="h-auto w-full border font-normal ring-0"
                        disabled={!!candidate && !!id}
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
                        {!!interviews.length
                          ? 'Select Template question'
                          : "you don't have template"}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      {!!interviews.length && (
                        <Select
                          onValueChange={field.onChange}
                          // value={field.value}
                          defaultValue={field.value}
                          disabled={!!candidate && !!id}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose Template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectGroup>
                              <SelectLabel className="text-md text-slate-600">
                                Select Template
                              </SelectLabel>
                              <SelectSeparator />
                              {interviews?.map((item) => (
                                <SelectItem value={item.id} key={item.id}>
                                  {item.title}
                                </SelectItem>
                              ))}
                              <SelectSeparator />
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel className="text-md text-slate-600">
                                Create New Template
                              </SelectLabel>
                              <SelectSeparator />
                              <div className="flex w-full flex-col justify-center text-sm">
                                <Button
                                  onClick={() => push(`/${orgId}/video/create`)}
                                >
                                  Create Template
                                </Button>
                              </div>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      {interviews.length === 0 && (
                        <div className="flex w-full flex-col justify-center text-sm">
                          <Button
                            onClick={() => push(`/${orgId}/video/create`)}
                          >
                            Create Template
                          </Button>
                        </div>
                      )}
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {watchTemplate && (
                <QuestionCard
                  key={selectedTemplate?.id}
                  title={selectedTemplate?.title}
                  id={selectedTemplate?.id}
                  question={selectedTemplate?.description!}
                  type="template"
                  dataSource={selectedTemplate}
                  isCandidates
                />
              )}

              <h4 className="my-4 text-xl font-semibold">Invites Candidates</h4>

              <div className="flex  w-full  gap-x-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="m-0 font-normal">
                        Full Name
                        <span className="text-destructive">*</span>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="m-0 font-normal">
                        Email
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <div className="flex gap-x-2">
                        <Input
                          type="email"
                          className="h-auto border font-normal ring-0"
                          onKeyDown={handleKeyDown}
                          {...field}
                        />
                        <div className="flex items-center gap-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-auto p-1"
                            onClick={addNameEmail}
                          >
                            <PlusCircle className="size-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className=" my-4 items-center gap-x-2 rounded-md bg-yellow-100 p-2 text-center text-sm italic">
              <p>
                Click the link bellow to download the template file and get
                started easily.
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
            <Button type="button" variant="secondary">
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
            <TableInvite
              dataSource={importedCandidates}
              setImportedCandidates={setImportedCandidates}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={!importedCandidates.length}>
              Save
            </Button>
          </div>
        </form>
      </Form>
      {isOpen && (
        <PopUpImportChecker
          setIsOpen={setIsOpen}
          dataSource={invalidData}
          onSubmit={handleFormSubmit}
        />
      )}
      {isPending && <Loader />}
    </>
  );
};

export default InviteCandidates;
