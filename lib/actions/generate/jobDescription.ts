'use server';

import { openai } from '@/lib/openai';
import { errorHandler } from '@/helpers';

const generateDescription = async (
  data: string,
  type: 'desc' | 'skill set' | 'responsibilities' | 'requirement',
) => {
  try {
    const prompt = `
    following the steps to create ${type} based on provided data. Restart each step before proceeding.
    Data: ${data}

    Step 1: Read the data.
    Step 2: Create a simple and clear ${type} based on the provided information.

     Output a JSON object structured like: 
    {
      "result":"the result output of ${type} generate"
    }
  `;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.75,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `create ${type}.`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    return errorHandler(error);
  }
};

export const actionDescription = async (data: string) =>
  generateDescription(data, 'desc');

export const actionSkill = async (title: string) =>
  generateDescription(title, 'skill set');

export const actionResponsibility = async (data: string) =>
  generateDescription(data, 'responsibilities');

export const actionRequirement = async (data: string) =>
  generateDescription(data, 'requirement');
