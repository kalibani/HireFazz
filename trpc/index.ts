import { publicProcedure, privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import prismadb from "@/lib/prismadb";
import { z } from "zod";

export const appRouter = router({
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    console.log("--> userId", userId);
    console.log("--> user", user);

    return await prismadb.file.findMany({
      where: {
        userId,
      },
    });
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
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
