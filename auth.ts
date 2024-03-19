import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prismadb from './lib/prismadb';
import { getUserById } from './lib/data';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: { signIn: '/auth/login', error: '/auth/error' },
  events: {
    async linkAccount({ user }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      // Prevent sign in without email verification
      // const existingUser = await getUserById(user.id!);
      // if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub.toString());
      if (!existingUser) return token;

      return token;
    },
  },

  adapter: PrismaAdapter(prismadb),
  ...authConfig,
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
});
