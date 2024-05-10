import { PayloadAddJob, createJob } from '@/lib/actions/job/createJob';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { z } from 'zod';

type TPayload = {
  payload: z.infer<typeof PayloadAddJob>;
  cv: FormData;
};

export const useCreateJob = (): UseMutationResult<
  unknown,
  Error,
  TPayload,
  unknown
> => {
  return useMutation({
    mutationKey: ['createJob'],
    mutationFn: async (payload) => await createJob(payload.payload, payload.cv),
  });
};
