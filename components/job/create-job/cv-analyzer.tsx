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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FC, ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import TrackingStep from './tracking-step';
import { useStore } from 'zustand';
import { useFormStepStore } from '@/zustand/useCreateJob';
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
import { MessageCircleQuestion } from 'lucide-react';
import { useGetOrgId } from '@/hooks/common/use-get-org';

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

const CVAnalyzer: FC = (): ReactElement => {
  const form = useForm();

  const { step, dataCreateJob, dataDetailJob, setStep, files, formData } =
    useStore(useFormStepStore, (state) => state);

  const { data, isSuccess } = useGetOrgId();

  const createJobHandle = () => {
    if (isSuccess && data) {
      const createPayload: z.infer<typeof PayloadAddJob> = {
        analyzeCv: false,
        jobName: dataCreateJob.title,
        location: dataCreateJob.location,
        salaryCurrency: dataCreateJob.currency,
        experience: Number(dataCreateJob.experiences),
        workModel: dataCreateJob.workModel,
        jobDescription: dataDetailJob,
        companyName: dataCreateJob.companyName,
        salaryRangeEnd: Number(dataCreateJob.toNominal),
        salaryRangeFrom: Number(dataCreateJob.fromNominal),
        orgId: data?.organizationId,
      };
      // submit to createJob at path folder: action/job.
    }
  };

  return (
    <section className="flex flex-col gap-y-3">
      <div className="flex h-full w-full flex-col items-center justify-start gap-y-8 rounded-lg bg-white p-8">
        <div className="flex w-1/2 flex-col items-center gap-y-4">
          <h1 className="text-2xl font-semibold">CV Analyzer</h1>
          <p className="text-sm">Try to upload and see our magic</p>
        </div>
        <Form {...form}>
          <form className="flex w-1/2 flex-col items-center gap-y-4">
            <div className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-6">
              <div className="flex gap-x-4">
                <IconRobot />
                <div className="flex w-full flex-col gap-y-1 text-white">
                  <h1 className="text-lg font-medium">Automatic CV Analyzer</h1>
                  <p className="text-sm">
                    {files.length} CV Will be analyze with our AI suggestion
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="flex flex-col text-right text-sm text-white">
                  <p>44 / 50 Free Generations</p>
                  <p>100 Token Available</p>
                </div>
                <IconBolt />
              </div>
            </div>

            <FormField
              control={form.control}
              name="customCriteria"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Custom Criteria ( You can reshape Custom criteria on AI  CV analyzer )" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex w-full flex-col gap-y-4">
              <FormField
                control={form.control}
                name="keyFocus"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Key Focus</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-x-4">
                <Button type="button" className="w-fit bg-slate-300 text-black">
                  + Key Focus
                </Button>

                <Button type="button" className="w-fit bg-slate-300 text-black">
                  + Key Focus
                </Button>

                <Button type="button" className="w-fit bg-slate-300 text-black">
                  + Key Focus
                </Button>

                <Button type="button" className="w-fit bg-slate-300 text-black">
                  + Key Focus
                </Button>
              </div>
            </div>

            <div className="flex w-full gap-x-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center gap-x-2">
                      Language AI <MessageCircleQuestion size={16} />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Indonesia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
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
                    <FormLabel>Set Match Percentage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="60%" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full items-center justify-between rounded-xl border border-slate-400 bg-white px-4 py-6">
              <div className="flex items-center gap-x-4">
                <IconFolderUp />
                <p className="text-sm text-black">
                  or <strong>Just Upload</strong>
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <Dialog>
        <div className="flex w-full justify-between rounded-lg bg-white px-8 py-4">
          <Button onClick={() => setStep(2)} variant="outline">
            Previous
          </Button>
          <DialogTrigger asChild>
            <Button onClick={createJobHandle}>Create</Button>
          </DialogTrigger>
        </div>
        <DialogContent className="flex min-h-[96%] min-w-[96%] flex-col items-center justify-between p-0">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col">
              <TrackingStep step={step} />
              <hr className="h-1 w-full border-slate-400" />
            </div>

            <div className="mt-8 flex w-1/2 flex-col items-center gap-y-4">
              <h1 className="text-2xl font-bold">
                Upload Process and AI Matching Score
              </h1>
              <p className="text-sm font-medium text-black">
                You can wait cvs being processed, or you can close this dialog.
              </p>
            </div>

            <div className="mt-8 w-full px-8">
              <Table className="border border-solid border-slate-200">
                <TableHeader className="bg-slate-200">
                  <TableRow>
                    <TableHead>Job Name ↓ </TableHead>
                    <TableHead className="text-center">Name of file</TableHead>
                    <TableHead className="text-center">Job</TableHead>
                    <TableHead className="text-center">Added On</TableHead>
                    <TableHead className="w-fit text-center">Upload</TableHead>
                    <TableHead className="w-fit text-center">
                      Annalyze AI
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Senior Software Engineer
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      143
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      20 Mar, 2024
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      10
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-green-500">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Senior Software Engineer
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      143
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      20 Mar, 2024
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      10
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-green-500">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Senior Software Engineer
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      143
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      20 Mar, 2024
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      10
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-green-500">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Senior Software Engineer
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      143
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      20 Mar, 2024
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      10
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-green-500">
                      <div className="flex w-full items-center gap-x-4">
                        <Progress value={20} className="h-3 w-full" />
                        <span className="w-full text-xs font-semibold text-slate-400">
                          20% Uploading
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="mt-4 flex w-full justify-end gap-x-3 p-4">
            <DialogTrigger asChild>
              <Button>Finish / Close</Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CVAnalyzer;
