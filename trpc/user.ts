import { privateProcedure, publicProcedure } from './trpc';
import { z } from 'zod';
import { signIn } from '@/auth';
import { TRPCError } from '@trpc/server';
import prismadb from '@/lib/prismadb';
import { increaseApiLimit } from '@/lib/api-limit';
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from '@/schemas';
import bcrypt from 'bcryptjs';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import {
  getUserByEmail,
  newPassword,
  newVerification,
  reset,
} from '@/lib/data';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

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

      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

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

  userRegister: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const validatedField = RegisterSchema.safeParse(input);
      if (!validatedField.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error field!',
        });
      }

      const { email, password, name } = validatedField.data;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Email already in use!',
        });
      }
      await prismadb.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: 'Confirmation email sent!' };
    }),

  userLogin: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ ctx, input }) => {
      const validatedField = LoginSchema.safeParse(input);

      if (!validatedField.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error field!',
        });
      }

      const { email, password, code, callbackUrl } = validatedField.data;
      const existingUser = await getUserByEmail(email);

      if (!existingUser || !existingUser.email || !existingUser.password) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Email does not exist!',
        });
      }

      // check if have emailVerified first
      // if (!existingUser.emailVerified) {
      //   const verificationToken = await generateVerificationToken(
      //     existingUser.email
      //   );

      //   await sendVerificationEmail(
      //     verificationToken.email,
      //     verificationToken.token
      //   );

      //   return { success: 'Verify your email first. Confirmation email sent!' };
      // }

      try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser || !existingUser.email || !existingUser.password) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Email does not exist!',
          });
        }
        await signIn('credentials', {
          email,
          password,
          redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
      } catch (error) {
        if (error instanceof AuthError) {
          if (error.type === 'CredentialsSignin') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Invalid credentials!',
            });
          } else {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Something went wrong!',
            });
          }
        }
      }
    }),

  userNewVerification: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      await newVerification(token);
    }),

  userResetPassword: publicProcedure
    .input(ResetSchema)
    .mutation(async ({ ctx, input }) => {
      await reset(input);
    }),

  userNewPassword: publicProcedure
    .input(NewPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      await newPassword(input);
    }),
};

export const {
  updateLimit,
  saveTransactions,
  updateUserSubscription,
  userRegister,
  userLogin,
  userNewVerification,
  userResetPassword,
  userNewPassword,
} = user;
