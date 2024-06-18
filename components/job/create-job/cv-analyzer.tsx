'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useEffect,
  useState,
  type FC,
  type ReactElement,
  type SVGProps,
} from 'react';
import { useForm } from 'react-hook-form';
import TrackingStep from './tracking-step';
import { useStore } from 'zustand';
import { FormStepState, useFormStepStore } from '@/zustand/useCreateJob';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { PayloadAddJob } from '@/lib/actions/job/createJob';
import { z } from 'zod';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TagInput } from '@/components/share/multi-tag-input';
import { useParams, useRouter } from 'next/navigation';
import { createJob } from '@/lib/actions/job/create-job-server';
import { formatDate } from 'date-fns';

import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationGroup } from '@/components/ui/pagination';
import { truncateString } from '@/lib/utils';
import { updateJobCvs } from '@/lib/actions/job/update-cv-job';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { Accordion } from '@radix-ui/react-accordion';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { errorToast } from '@/components/toasterProvider';
import axios, { AxiosProgressEvent } from 'axios';
import { queryClient } from '@/components/Providers';
import { useTranslations } from 'next-intl';

const IconRobot: FC = (): ReactElement => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 9.4V1H13.6M1 22H5.2M15.7 19.9V24.1M28.3 19.9V24.1M38.8 22H43M13.6 34.6L5.2 43V13.6C5.2 12.4861 5.6425 11.4178 6.43015 10.6302C7.2178 9.8425 8.28609 9.4 9.4 9.4H34.6C35.7139 9.4 36.7822 9.8425 37.5698 10.6302C38.3575 11.4178 38.8 12.4861 38.8 13.6V30.4C38.8 31.5139 38.3575 32.5822 37.5698 33.3698C36.7822 34.1575 35.7139 34.6 34.6 34.6H13.6Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBolt: FC = (): ReactElement => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="white" />
    <path
      d="M17.3747 12.694H19.0592C19.2928 12.6941 19.5227 12.7524 19.7283 12.8636C19.9339 12.9748 20.1088 13.1354 20.2374 13.3311C20.3659 13.5268 20.4441 13.7514 20.465 13.9848C20.4858 14.2182 20.4486 14.4532 20.3567 14.6687L16.628 23.4019C16.538 23.611 16.3789 23.7826 16.1776 23.8879C15.9763 23.9931 15.745 24.0256 15.5226 23.9798C15.3002 23.934 15.1004 23.8127 14.9567 23.6364C14.8129 23.4601 14.7341 23.2394 14.7335 23.0117V16.4733L13.3653 16.4308C12.999 16.4186 12.6517 16.2639 12.3969 15.9994C12.1421 15.7349 11.9998 15.3814 12 15.0136V9.41726C12 9.04138 12.1488 8.6809 12.4137 8.41511C12.6786 8.14932 13.0378 8 13.4124 8H15.9623C16.3369 8 16.6961 8.14932 16.961 8.41511C17.2259 8.6809 17.3747 9.04138 17.3747 9.41726V12.694Z"
      fill="#E11D48"
    />
  </svg>
);

const IconFolderUp: FC = (): ReactElement => (
  <svg
    width="44"
    height="38"
    viewBox="0 0 44 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 15.7V28.3M22 15.7L15.7 22M22 15.7L28.3 22M38.8 36.7C39.9139 36.7 40.9822 36.2575 41.7698 35.4699C42.5575 34.6822 43 33.6139 43 32.5V11.5C43 10.3861 42.5575 9.3178 41.7698 8.53015C40.9822 7.7425 39.9139 7.3 38.8 7.3H22.21C21.5076 7.30689 20.8146 7.13748 20.1946 6.8073C19.5746 6.47711 19.0473 5.99669 18.661 5.41L16.96 2.89C16.5776 2.30929 16.0569 1.83261 15.4448 1.50273C14.8327 1.17286 14.1483 1.00011 13.453 1H5.2C4.08609 1 3.0178 1.4425 2.23015 2.23015C1.4425 3.0178 1 4.08609 1 5.2V32.5C1 33.6139 1.4425 34.6822 2.23015 35.4699C3.0178 36.2575 4.08609 36.7 5.2 36.7H38.8Z"
      stroke="#E11D48"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconQuestionMark: FC<SVGProps<SVGSVGElement>> = (props): ReactElement => (
  <svg
    {...props}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_3131_2037)">
      <path
        d="M7.00033 12.8332C10.222 12.8332 12.8337 10.2215 12.8337 6.99984C12.8337 3.77818 10.222 1.1665 7.00033 1.1665C3.77866 1.1665 1.16699 3.77818 1.16699 6.99984C1.16699 10.2215 3.77866 12.8332 7.00033 12.8332Z"
        stroke="#94A3B8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.30273 5.24984C5.43988 4.85998 5.71057 4.53124 6.06687 4.32184C6.42318 4.11244 6.84209 4.03589 7.24942 4.10576C7.65675 4.17563 8.02621 4.3874 8.29236 4.70357C8.55851 5.01974 8.70418 5.4199 8.70357 5.83318C8.70357 6.99984 6.95357 7.58318 6.95357 7.58318"
        stroke="#94A3B8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.9165H7.00667"
        stroke="#94A3B8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3131_2037">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const schema = z.object({
  customCriteria: z.string(),
  analyzeCv: z.boolean().default(true),
  justUpload: z.boolean().default(false),
  keyFocus: z.array(z.string()).default([]),
  language: z.string(),
  matchPercentage: z.string(),
});
const percentages = [10, 20, 30, 40, 50, 60, 70, 80];

const CVAnalyzer: FC<{ isUpdate: boolean }> = ({ isUpdate }): ReactElement => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      analyzeCv: true,
    },
  });
  const [jobId, setJobId] = useState<string>('');
  const t = useTranslations('CreateJob')

  const { orgId, id } = useParams();

  const [analyzeAIPercentage, setAnalyzeAIPercentage] = useState<number>(0);
  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  // pagination state
  const [perPage, setPerPage] = useState(10);
  const [itemsInPage, setItemsInPage] = useState<FormStepState['files']>([]);
  const [activePage, setActivePage] = useState(1);
  const [isErrorCreate, setIsErrorCreate] = useState(false);

  const {
    step,
    dataCreateJob,
    dataDetailJob,
    setStep,
    setFiles,
    files,
    formData,
    resetFormCreateJob,
    resetFormDetailJob,
  } = useStore(useFormStepStore, (state) => state);

  const createJobHandle = async () => {
    const requestForm = new FormData();
    formData.forEach((value, key) => {
      requestForm.append(key, value);
    });

    if (orgId) {
      const createPayload: z.infer<typeof PayloadAddJob> = {
        analyzeCv: form.watch('analyzeCv'),
        jobName: dataCreateJob.title,
        location: dataCreateJob.location,
        salaryCurrency: dataCreateJob.currency,
        experience: Number(dataCreateJob.experiences),
        workModel: dataCreateJob.workModel,
        jobDescription: dataDetailJob,
        companyName: dataCreateJob.companyName,
        salaryRangeEnd: Number(dataCreateJob.toNominal),
        salaryRangeFrom: Number(dataCreateJob.fromNominal),
        orgId: orgId as string,
        languageAi: form.watch('language'),
        matchPercentage: form.watch('matchPercentage'),
        keyFocus: form.watch('keyFocus'),
      };
      requestForm.append('createPayload', JSON.stringify(createPayload));

      try {
        const job = await (
          await axios.post('/api/job/create', requestForm)
        ).data;
        setJobId(job?.id);
        setIsErrorCreate(false);
      } catch (error) {
        setIsErrorCreate(true);
        return errorToast(typeof error === 'string' ? error : undefined);
      }
    }
  };

  const router = useRouter();

  // handle files list in pagination
  useEffect(() => {
    const startItem = (activePage - 1) * perPage;
    const endItem = activePage * perPage;

    const paginatedFile = files.slice(startItem, endItem);
    setItemsInPage(paginatedFile);
  }, [files, perPage, activePage]);

  // set state of pagination
  const handlePagination = (type: 'per_page' | 'page', value: string) => {
    if (type === 'per_page') {
      setPerPage(Number(value));
      setActivePage(1);
    } else {
      setActivePage(Number(value));
    }
  };

  const navigateToAllApplicant = () => {
    resetFormCreateJob();
    resetFormDetailJob();
    setFiles([]);
    setStep(0);
    router.push(`${jobId}/all-applicant`);
  };
  const tokenData = queryClient.getQueryData(['available-Token']);

  return (
    <section className="flex flex-1 flex-col gap-y-3 overflow-y-scroll">
      <div className="flex h-full w-full flex-col items-center justify-start gap-y-8 rounded-lg bg-white p-8">
        {files.length === 0 && (
          <div className="flex w-1/2 flex-col items-center gap-y-4 rounded-md bg-yellow-200 p-4 text-sm font-normal capitalize italic">
            <p>
              To proceed with the analysis,{' '}
              <strong>please upload your CV files.</strong> Thank you!
            </p>
          </div>
        )}
        <Form {...form}>
          <form className="flex w-1/2 flex-col items-center gap-y-4">
            <div className="flex w-full items-center gap-x-4">
              <FormField
                control={form.control}
                name="analyzeCv"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange(!field.value);
                          form.setValue('justUpload', false);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-6">
                <div className="flex gap-x-4">
                  <IconRobot />
                  <div className="flex w-full flex-col gap-y-1 text-white">
                    <h1 className="text-lg font-medium">
                      {t('automaticCVAnalyzer')}
                    </h1>
                    <p className="text-sm">
                      {t('amountToAnalyze', { amount: files.length })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="flex flex-col text-right text-sm text-white">
                    {/* <p>{t('freeProcessAmount', { process: '44 / 50' })}</p> */}
                    <p>{t('tokenRemaining', { amount: tokenData.availableTokens })}</p>
                  </div>
                  <IconBolt />
                </div>
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full rounded-md border px-4"
            >
              <AccordionItem value="customCriteria" className="border-b-0">
                <AccordionTrigger className="h-0 text-sm font-normal hover:no-underline ">
                  {t('criteria')}
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  <div className="flex w-full flex-col gap-y-4">
                    <FormField
                      control={form.control}
                      name="keyFocus"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex items-center gap-x-2 py-2">
                            {t('keyFocus')}
                          </FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              tags={tags}
                              className="sm:min-w-[450px]"
                              setTags={(newTags) => {
                                setTags(newTags);
                                form.setValue(
                                  'keyFocus',
                                  newTags as [string, ...string[]],
                                );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4 flex w-full gap-x-4">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex items-center gap-x-2 py-2">
                            {t('languageAI')}{' '}
                            <HoverCard>
                              <HoverCardTrigger>
                                <IconQuestionMark />
                              </HoverCardTrigger>
                              <HoverCardContent className="h-fit w-[160px] rounded-lg border border-slate-400 p-3">
                                <span className="text-left text-xs text-slate-400">
                                  {t('languageAITooltip')}
                                </span>
                              </HoverCardContent>
                            </HoverCard>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={'indonesia'}
                                  placeholder="Indonesia"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="indonesia">
                                Indonesia
                              </SelectItem>
                              <SelectItem value="english">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="matchPercentage"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex items-center gap-x-2 py-2">
                            {t('setMatchPercentage')}{' '}
                            <HoverCard>
                              <HoverCardTrigger>
                                <IconQuestionMark />
                              </HoverCardTrigger>
                              <HoverCardContent className="h-fit w-[160px] rounded-lg border border-slate-400 p-3">
                                <span className="text-left text-xs text-slate-400">
                                  {t('setMatchPercentageTooltip')}
                                </span>
                              </HoverCardContent>
                            </HoverCard>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={60}
                                  placeholder="60%"
                                />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {percentages.map((percentage) => (
                                <SelectItem
                                  key={percentage}
                                  value={percentage.toString()}
                                >
                                  {percentage}%
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex w-full items-center gap-x-4">
              <FormField
                control={form.control}
                name="justUpload"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange(!field.value);
                          form.setValue('analyzeCv', false);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-4 py-6">
                <div className="flex items-center gap-x-4">
                  <IconFolderUp />
                  <p className="text-sm text-black">
                    {t.rich('justUpload', { b: (chunks) => <b>{chunks}</b>} )}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Prevent open if there is error creating job */}
      <Dialog open={isErrorCreate ? false : undefined}>
        <div className="flex w-full justify-between rounded-lg bg-white px-8 py-4">
          <Button onClick={() => setStep(2)} variant="outline">
            {t('cta_prev')}
          </Button>
          <DialogTrigger asChild>
            <Button
              disabled={files.length === 0}
              onClick={() => {
                isUpdate
                  ? updateJobCvs(
                      {
                        orgId: orgId as string,
                        jobId: id as string,
                        analyzeCv: form.watch('analyzeCv'),
                      },
                      formData,
                    )
                  : createJobHandle();
              }}
            >
              {t('cta_create')}
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="flex h-[90%] min-h-[90%] w-[90%] min-w-[90%] flex-col items-center justify-between overflow-y-auto p-0">
          <div className="flex h-full w-full -translate-y-[32px] flex-col items-center">
            <div className="sticky top-[35px] z-40 flex w-full flex-col">
              <TrackingStep
                step={step}
                customTitle={dataCreateJob.title}
                customSubTitle=""
              />
              <hr className="h-1 w-full border-slate-400" />
            </div>

            <div className="mt-8 flex w-1/2 flex-col items-center gap-y-4">
              <h1 className="text-2xl font-bold">
                {t('analyzeTitle')}
              </h1>
              <p className="text-sm font-medium text-black text-center">
                {t('analyzeSubTitle')}
              </p>
            </div>

            <div className="mt-8 h-full w-full flex-1 overflow-y-auto px-8">
              <Table className="border border-solid border-slate-200">
                <TableHeader className="sticky -top-[1px] z-10 bg-slate-200">
                  <TableRow>
                    <TableHead className="text-center">Name of file</TableHead>
                    <TableHead className="text-center">Source</TableHead>
                    <TableHead className="w-fit text-center">Upload</TableHead>

                    {form.watch('analyzeCv') && (
                      <TableHead className="w-fit text-center">
                        Analyze AI
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsInPage.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center text-slate-400">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p>{truncateString(file.file.name, 30)}</p>
                            </TooltipTrigger>
                            <TooltipContent
                              className="rounded-md bg-gray-900 p-2 text-slate-300"
                              hidden={file.file.name.length <= 30}
                            >
                              {file.file.name}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-center text-slate-400">
                        {t('fromDevice')}
                      </TableCell>
                      <TableCell className="text-center text-slate-400">
                        <div className="flex w-full items-center gap-x-4">
                          <span className="w-full text-xs font-semibold text-slate-400">
                            {t('processing')}
                          </span>
                        </div>
                      </TableCell>
                      {form.watch('analyzeCv') && (
                        <TableCell className="text-center text-green-500">
                          <div className="flex w-full items-center gap-x-4">
                            <span className="w-full text-xs font-semibold text-slate-400">
                              {t('processing')}
                            </span>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <PaginationGroup
                perPage={perPage}
                totalItems={files.length}
                activePage={activePage}
                handlePagination={handlePagination}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex w-full justify-end gap-x-3 p-4">
            <DialogTrigger asChild>
              <Button onClick={navigateToAllApplicant}>
                {t('cta_finish')}
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CVAnalyzer;
