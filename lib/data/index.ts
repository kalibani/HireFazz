import prismadb from '../prismadb';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
