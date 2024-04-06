import prismadb from '@/lib/prismadb';
import { NewPasswordSchema, ResetSchema } from '@/lib/validators/auth';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '../mail';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prismadb.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prismadb.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Token does not exist!',
    });
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Token has expired!',
    });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Email does not exist!',
    });
  }

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prismadb.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prismadb.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prismadb.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Invalid emaiL!',
    });
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Email does not exist!',
    });
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Reset email sent!' };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>
) => {
  if (!values.token) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Missing token!',
    });
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid fields!',
    });
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(values.token);

  if (!existingToken) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Invalid token!',
    });
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Token has expired!',
    });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new TRPCError({
      code: 'TIMEOUT',
      message: 'Email does not exist!',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prismadb.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Password updated!' };
};
