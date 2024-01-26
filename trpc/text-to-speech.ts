import { privateProcedure } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prismadb from "@/lib/prismadb";

const TextToSpeech = {
  // save history
  saveGeneratedVoice: privateProcedure
    .input(
      z.object({
        characterCountChangeFrom: z.number(),
        characterCountChangeTo: z.number(),
        contentType: z.string(),
        dateUnix: z.number(),
        feedback: z.object({}).nullish(),
        historyItemId: z.string(),
        modelId: z.string(),
        requestId: z.string(),
        settings: z.object({
          similarity_boost: z.number(),
          stability: z.number(),
          style: z.number(),
          use_speaker_boost: z.boolean(),
        }),
        shareLinkId: z.string().nullish(),
        state: z.string(),
        text: z.string(),
        voiceCategory: z.string(),
        voiceId: z.string(),
        voiceName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const generatedVoice = await prismadb.generatedVoices.create({
        data: {
          characterCountChangeFrom: input.characterCountChangeFrom,
          characterCountChangeTo: input.characterCountChangeTo,
          contentType: input.contentType,
          dateUnix: input.dateUnix,
          // @ts-ignore
          feedback: input.feedback,
          historyItemId: input.historyItemId,
          modelId: input.modelId,
          requestId: input.requestId,
          settings: input.settings,
          shareLinkId: input.shareLinkId,
          isPaid: false,
          // @ts-ignore
          state: input.state,
          text: input.text,
          voiceCategory: input.voiceCategory,
          voiceId: input.voiceId,
          voiceName: input.voiceName,
          userId: userId,
        },
      });

      return { generatedVoice };
    }),

  // get history
  getGeneratedVoices: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        offset: z.number().min(0),
        isPaid: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const limit = input.limit || 0;
      const offset = input.offset || 0;
      const isPaid = input.isPaid;

      const [count, generatedVoices] = await prismadb.$transaction([
        prismadb.generatedVoices.count({
          where: {
            userId,
            isPaid,
          },
        }),
        prismadb.generatedVoices.findMany({
          take: limit,
          skip: offset,
          where: {
            userId,
            isPaid,
          },
          orderBy: {
            dateUnix: "desc",
          },
          select: {
            id: true,
            text: true,
            dateUnix: true,
            voiceName: true,
            state: true,
            isPaid: true,
            historyItemId: true,
          },
        }),
      ]);

      return {
        generatedVoices,
        count: count,
      };
    }),

  // delete history
  deleteGeneratedVoices: privateProcedure
    .input(
      z.object({
        ids: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const generatedVoice = await prismadb.generatedVoices.deleteMany({
        where: {
          userId,
          id: {
            in: input.ids,
          },
        },
      });

      return { generatedVoice };
    }),

  updateGeneratedVoiceStatus: privateProcedure
    .input(
      z.object({
        isPaid: z.boolean(),
        historyItemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!input.historyItemId) throw new TRPCError({ code: "NOT_FOUND" });

      const generatedVoice = await prismadb.generatedVoices.findFirst({
        where: {
          historyItemId: input.historyItemId,
        },
      });

      if (generatedVoice) {
        const updatedVoice = await prismadb.generatedVoices.update({
          where: { historyItemId: input.historyItemId },
          data: {
            isPaid: input.isPaid,
          },
        });
        return { updatedVoice };
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  getGeneratedVoice: privateProcedure
    .input(
      z.object({
        historyItemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!input.historyItemId) throw new TRPCError({ code: "NOT_FOUND" });

      const generatedVoice = await prismadb.generatedVoices.findFirst({
        where: {
          historyItemId: input.historyItemId,
        },
      });

      if (generatedVoice) {
        return { generatedVoice };
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
};

export const {
  saveGeneratedVoice,
  getGeneratedVoices,
  deleteGeneratedVoices,
  updateGeneratedVoiceStatus,
  getGeneratedVoice,
} = TextToSpeech;
