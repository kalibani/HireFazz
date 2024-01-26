import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/constant";
import {
  deleteGeneratedVoices,
  getGeneratedVoices,
  saveGeneratedVoice,
  updateGeneratedVoiceStatus,
  getGeneratedVoice,
} from "./text-to-speech";
import {
  deleteFile,
  getFile,
  getFileMessages,
  getFileUploadStatus,
  getUserFiles,
} from "./document-interaction";
import { updateLimit, saveTransactions, updateUserSubscription } from "./user";

export const appRouter = router({
  // Document Interaction
  getUserFiles: getUserFiles,
  getFile: getFile,
  getFileMessages: getFileMessages,
  getFileUploadStatus: getFileUploadStatus,
  deleteFile: deleteFile,

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

  // Text To Speech TRPC
  saveGeneratedVoice: saveGeneratedVoice,
  getGeneratedVoices: getGeneratedVoices,
  deleteGeneratedVoices: deleteGeneratedVoices,

  // User
  updateLimit: updateLimit,
  saveTransactions: saveTransactions,
  updateUserSubscription: updateUserSubscription,
  updateGeneratedVoiceStatus: updateGeneratedVoiceStatus,
  getGeneratedVoice: getGeneratedVoice,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
