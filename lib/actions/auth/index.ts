'use server';

import { getUserByEmail } from '@/lib/data';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema, RegisterSchema } from '@/lib/validators/auth';
import { signIn } from '@/auth';
import { z } from 'zod';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { PACKAGE_TYPE } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const userLoginAction = async (payload: z.infer<typeof LoginSchema>) => {
  try {
    const validatedField = LoginSchema.parse(payload);
    const { email, password, code, callbackUrl } = validatedField;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: 'Email does not exist!' };
    }
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: `Welcome ${existingUser.name} ` };
  } catch (error) {
    return errorHandler(error);
  }
};

export const userRegisterAction = async (
  payload: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedField = RegisterSchema.parse(payload);
    const { email, password, name } = validatedField;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: 'Email already in use!' };
    }

    await prismadb.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      await tx.organization.create({
        data: {
          name: name,
          packageType: PACKAGE_TYPE.BASIC,
          limit: 100,
          used: 0,
          agreeTermAndCondition: true,
          userOrganization: {
            create: {
              userId: newUser.id,
              roleId: 'OWNER',
            },
          },
        },
      });
    });

    await userLoginAction({ email, password });
    return { success: 'Confirmation email sent!' };
  } catch (error) {
    return errorHandler(error);
  }
};
