'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
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
} from '../ui/select';
import { LINK_TEMPLATE_CSV } from '@/constant';
import QuestionCard from './question-card';
import createInviteCandidates from '@/lib/actions/interview/inviteCandidates';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '../share';

import PopUpImportChecker from './popup-import-email';

export const CandidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
const FormSchema = z.object({
  title: z.string().min(2),
  template: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const searchParam = useSearchParams();
  const id = searchParam.get('idInvite');
  const pathname = usePathname();
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [importedCandidates, setImportedCandidates] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [invalidData, setInvalidData] = useState<any[]>([]);

  const watchTemplate = form.watch('template');

  useEffect(() => {
    if (id && candidate) {
      form.setValue('title', candidate.name);
      form.setValue('template', candidate.templateId);
    }
  }, [id, form, candidate]);

  const selectedTemplate = useMemo(() => {
    const selectedCard = interviews.filter((item) => item.id === watchTemplate);
    return selectedCard[0];
  }, [watchTemplate, interviews]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!!data) {
      const parsedData = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
      };
      const finalCandidates = mergeCandidates([parsedData], importedCandidates);
      setTitle(data.title);
      setImportedCandidates(finalCandidates);
      if (!!id) {
        form.resetField('name');
        form.resetField('email');
      }
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
              if (CandidateSchema.safeParse(item).success) {
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

  const invitedHandler = () => {
    if (importedCandidates && title && orgId) {
      startTransition(() => {
        const payload = {
          importedCandidates,
          title,
          orgId,
          templateId: selectedTemplate.id,
        };
        createInviteCandidates(payload)
          .then(async (data) => console.log(data?.success))
          .catch((error) => console.log(error))
          .finally(() => {
            push(`${pathname}/video?tab=candidates`);
          });
      });
    }
  };

  const handleFormSubmit = (updatedData: any) => {
    console.log('Form submitted with data:', updatedData);
    const validCandidates: any[] = [];
    const invalidCandidates: any[] = [];

    updatedData.forEach((item: any) => {
      if (CandidateSchema.safeParse(item).success) {
        validCandidates.push({ ...item });
      } else {
        invalidCandidates.push({ ...item });
      }
    });
    const finalCandidates = mergeCandidates(
      validCandidates,
      importedCandidates,
    );
    setImportedCandidates(finalCandidates);
    if (invalidCandidates.length > 0) {
      setInvalidData(invalidCandidates);
      setIsOpen(true);
    }
    // setImportedCandidates
  };

  return (
    <>
      <Form {...form}>
        <div className="rounded-md bg-white p-4">
          <h3 className="text-2xl font-semibold">
            Create Interview Candidates
          </h3>
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
                        Select Template question
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!!candidate && !!id}
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

              {/* {fields.map((field, index) => (
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
                  </div>
                ))} */}

              <div className="flex  w-full  gap-x-2">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="m-0 font-normal">Email</FormLabel>
                      <div className="flex gap-x-2">
                        <Input
                          type="email"
                          className="h-auto border font-normal ring-0"
                          {...field}
                        />
                        <div className="flex items-center gap-x-1">
                          <Button
                            type="submit"
                            variant="ghost"
                            className="h-auto p-1"
                          >
                            <PlusCircle className="size-4 text-primary" />
                          </Button>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
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
          <TableInvite dataSource={importedCandidates} />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={importedCandidates.length === 0}
            onClick={invitedHandler}
          >
            Save
          </Button>
        </div>
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
