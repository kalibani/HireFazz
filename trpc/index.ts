import { publicProcedure, privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import prismadb from "@/lib/prismadb";
import { z } from "zod";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/constant";
import { MAX_FREE_COUNTS } from "@/constant";

export const appRouter = router({
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

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await prismadb.file.findMany({
      where: {
        userId,
      },
    });
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
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

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await prismadb.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
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

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await prismadb.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

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

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  getSingleFile: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await prismadb.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

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

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await prismadb.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/pricing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await prismadb.userAPILimit.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Premium")?.price.priceIds
            .test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  }),

  getGeneratedVoices: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        offset: z.number().min(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const limit = input.limit || 0;
      const offset = input.offset || 0;

      const [count, generatedVoices] = await prismadb.$transaction([
        prismadb.generatedVoices.count({
          where: {
            userId,
          },
        }),
        prismadb.generatedVoices.findMany({
          take: limit,
          skip: offset,
          where: {
            userId,
          },
          select: {
            id: true,
            text: true,
            dateUnix: true,
            voiceName: true,
            state: true,
          },
        }),
      ]);

      return {
        generatedVoices,
        count: count,
      };
    }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
