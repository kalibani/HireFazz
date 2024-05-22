'use server';

import { openai } from '@/lib/openai';
import { errorHandler } from '@/helpers';

const generateDescription = async (
  data: string,
  type: 'desc' | 'skill set' | 'responsibilities' | 'requirement job',
) => {
  try {
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

      Return the output as a JSON object in the following format:
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

export const actionDescription = async (data: string) =>
  generateDescription(data, 'desc');

export const actionSkill = async (title: string) =>
  generateDescription(title, 'skill set');

export const actionResponsibility = async (data: string) =>
  generateDescription(data, 'responsibilities');

export const actionRequirement = async (data: string) =>
  generateDescription(data, 'requirement job');
