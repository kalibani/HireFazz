import prismadb from '@/lib/prismadb';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};
