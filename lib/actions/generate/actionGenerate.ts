import { checkValidJSON } from '@/lib/utils';
import { formSchemaCreateJob } from '@/lib/validators/createJob';
import { z } from 'zod';
import {
  actionDescription,
  actionSkill,
  actionResponsibility,
  actionRequirement,
} from './jobDescription';

export const genereteJobDescription = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  try {
    const result: any = await actionDescription(JSON.stringify(data));

    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

export const generateSkill = async (title: string) => {
  try {
    const result: any = await actionSkill(title);
    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

export const generateResponsibilities = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  const { title, experiences, workModel } = data;
  try {
    const result: any = await actionResponsibility(
      JSON.stringify({ title, experiences, workModel }),
    );

    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};
export const generateRequirement = async (
  data: z.infer<typeof formSchemaCreateJob>,
) => {
  try {
    const result: any = await actionRequirement(JSON.stringify(data));
    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};
