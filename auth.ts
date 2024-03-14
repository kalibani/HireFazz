import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prismadb from './lib/prismadb';
import authConfig from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  pages: { signIn: '/login' },
  adapter: PrismaAdapter(prismadb),
  ...authConfig,
});
