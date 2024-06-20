'use server';

import { openai } from '@/lib/openai';
import { errorHandler } from '@/helpers';
import { Locale } from '@/i18n';

const generateDescription = async (
  data: string,
  type: 'desc' | 'skill set' | 'responsibilities' | 'requirement job',
  language: Locale,
) => {
  try {
    const lang = language === 'en' ? 'English' : 'Indonesian'
    const typeSpecificInstruction = {
      desc: 'Generate a general description based on the data provided.',
      'skill set':
        'Generate a list of key skill points based on the data provided, using simple keywords or short phrases without explicit labels.',
      'requirement job':
        'Generate a list of up to 8 professional skills job requirements based on the data provided, using simple sentences without explicit labels.',
      responsibilities:
        'Generate a list of up to 8 professional responsibilities based on the data provided, using simple sentences without explicit labels.',
    };
    const prompt = `
      Given the following data, generate a ${type}:

      Data: ${data}

      Requirements:
      1. Read the data carefully.
      2. Create a clear and concise ${type}.
     ${typeSpecificInstruction[type] || ''}

      Return the output as a JSON object, the language should be ${lang}, in the following format:
       {
        "result": ${
          type === 'requirement job' ||
          type === 'responsibilities' ||
          type === 'skill set'
            ? '[Generated list here]'
            : '"Generated ${type} here"'
        }
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
          content: `Generate the ${type}.`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    return errorHandler(error);
  }
};

export const actionDescription = async (data: string, lang: Locale) =>
  generateDescription(data, 'desc', lang);

export const actionSkill = async (title: string, lang: Locale) =>
  generateDescription(title, 'skill set', lang);

export const actionResponsibility = async (data: string, lang: Locale) =>
  generateDescription(data, 'responsibilities', lang);

export const actionRequirement = async (data: string, lang: Locale) =>
  generateDescription(data, 'requirement job', lang);
