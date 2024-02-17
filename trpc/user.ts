import { privateProcedure } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prismadb from "@/lib/prismadb";
import { increaseApiLimit } from "@/lib/api-limit";

const user = {
  // get history
  updateLimit: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    await increaseApiLimit(userId);
  }),

  saveTransactions: privateProcedure
    .input(
      z.object({
        amountPaid: z.number(),
        orderId: z.string(),
        productName: z.string(),
      })
    )

    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const transactionGenerated = await prismadb.transactions.create({
        data: {
          amountPaid: input.amountPaid,
          orderId: input.orderId,
          productName: input.productName,
          userId: userId,
        },
      });

      return { transactionGenerated };
    }),

  updateUserSubscription: privateProcedure
    .input(
      z.object({
        characterCount: z.number().nullish(),
        maxFreeCount: z.number().nullish(),
        subscriptionType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const user = await prismadb.userAPILimit.findUnique({
        where: {
          userId: userId,
        },
      });

      if (user) {
        const response = await prismadb.userAPILimit.update({
          where: { userId: userId },
          data: {
            characterCount: user.characterCount! + input.characterCount!,
            maxFreeCount: input.maxFreeCount,
            count: 0,
            // @ts-ignore
            subscriptionType: input.subscriptionType,
          },
        });
        return response.subscriptionType;
      }
    }),

  // delete history
};

export const { updateLimit, saveTransactions, updateUserSubscription } = user;
