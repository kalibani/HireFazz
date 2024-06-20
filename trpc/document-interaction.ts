import { privateProcedure } from './trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { pinecone } from '@/lib/pinecone';
import prismadb from '@/lib/prismadb';
import { MAX_FREE_COUNTS } from '@/constant';
import { utapi } from '@/lib/upload-thing-server';
import { currentUser } from '@/lib/auth';

const DocumentInteraction = {
  // get User Files
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await prismadb.file.findMany({
      where: {
        userId,
      },
    });
  }),

  // get file messages
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? MAX_FREE_COUNTS;

      const file = await prismadb.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      const messages = await prismadb.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  // get upload file status
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await prismadb.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: 'PENDING' as const };

      return { status: file.uploadStatus };
    }),

  // get file
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await prismadb.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      return file;
    }),

  // get file
  getFileById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await prismadb.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      return file;
    }),

  // delete file
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await prismadb.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });
      await utapi.deleteFiles(input.id);
      await prismadb.file.delete({
        where: {
          id: input.id,
        },
      });
      const index = process.env.NEXT_PUBLIC_PINECONE_INDEX;

      const pineconeIndex = pinecone.Index(index!);
      await pineconeIndex.namespace(input.id).deleteAll();
      return file;
    }),
  infiniteFiles: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;
      const user = await currentUser();

      const limit = input.limit ?? 5;
      const { cursor } = input;
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
    }),
};

export const {
  getFile,
  getFileMessages,
  getFileUploadStatus,
  deleteFile,
  getUserFiles,
  getFileById,
  infiniteFiles,
} = DocumentInteraction;
