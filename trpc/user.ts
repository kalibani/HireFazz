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

  // delete history
};

export const { updateLimit } = user;
