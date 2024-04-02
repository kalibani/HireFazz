'use server';

import {
  GetCvValidation,
  deleteFileById,
  getFilesValidation,
} from '@/lib/validators/cv-scanner';
import { currentUser } from '@/lib/auth';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { errorHandler } from '@/helpers';
import { pinecone } from '@/lib/pinecone';
import { utapi } from '@/lib/upload-thing-server';

export const infiniteFilesAction = async (
  input: z.infer<typeof GetCvValidation>
) => {
  const validateInput = GetCvValidation.parse(input);
  const { cursor } = validateInput;
  const limit = input.limit || 5;
  const user = await currentUser();

  const items = await prismadb.file.findMany({
    take: limit + 1, // get an extra item at the end which we'll use as next cursor
    where: {
      userId: user?.id,
    },
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem!.id;
  }
  return {
    items,
    nextCursor,
  };
};

export const getFileAction = async (
  input: z.infer<typeof getFilesValidation>
) => {
  try {
    const user = await currentUser();
    const validateInput = getFilesValidation.parse(input);
    const { key } = validateInput;
    const file = await prismadb.file.findFirst({
      where: {
        key,
        userId: user?.id,
      },
    });
    return file;
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteFileAction = async (
  input: z.infer<typeof deleteFileById>
) => {
  try {
    const user = await currentUser();
    const validateInput = deleteFileById.parse(input);
    const { id } = validateInput;
    const file = await prismadb.file.findFirst({
      where: {
        id,
        userId: user?.id,
      },
    });

    await utapi.deleteFiles(id);
    await prismadb.file.delete({
      where: {
        id,
      },
    });
    const index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

    const pineconeIndex = pinecone.Index(index!);
    await pineconeIndex.namespace(id).deleteAll();
    return file;
  } catch (error) {
    return errorHandler(error);
  }
};
