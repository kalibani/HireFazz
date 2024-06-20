import { checkValidJSON } from '@/lib/utils';
import { FormSchemaCreateJob } from '@/lib/validators/createJob';
import { z } from 'zod';
import {
  actionDescription,
  actionSkill,
  actionResponsibility,
  actionRequirement,
} from './jobDescription';
import { Locale } from '@/i18n';

export const genereteJobDescription = async (
  data: z.infer<FormSchemaCreateJob>,
  lang: Locale
) => {
  try {
    const result: any = await actionDescription(JSON.stringify(data), lang);

    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};

export const generateSkill = async (title: string, lang: Locale) => {
  try {
    const result: any = await actionSkill(title, lang);
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
  data: z.infer<FormSchemaCreateJob>,
  lang: Locale
) => {
  const { title, experiences, workModel } = data;
  try {
    const result: any = await actionResponsibility(
      JSON.stringify({ title, experiences, workModel }),
      lang
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
export const generateRequirement = async (data: {
  title: string;
  experiences: string;
  location: string;
  workModel: string;
  companyName: string;
}, lang: Locale) => {
  try {
    const result: any = await actionRequirement(JSON.stringify(data), lang);
    const isValidJSON = checkValidJSON(result);
    if (isValidJSON) {
      const res = JSON.parse(result);
      return res;
    }
  } catch (error) {
    return { error: 'something went wrong' };
  }
};
