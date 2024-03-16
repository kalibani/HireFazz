import { privateProcedure } from './trpc';
import { z } from 'zod';
import { signIn } from '@/auth';
import { TRPCError } from '@trpc/server';
import prismadb from '@/lib/prismadb';
import { increaseApiLimit } from '@/lib/api-limit';
import { LoginSchema, RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/lib/data';

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

  userRegister: privateProcedure
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
      console.log({ name, email, password });
      await prismadb.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      return { succes: 'User created' };
    }),

  userLogin: privateProcedure
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
};

export const {
  updateLimit,
  saveTransactions,
  updateUserSubscription,
  userRegister,
  userLogin,
} = user;
