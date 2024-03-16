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
  pages: { signIn: '/auth/login' },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user.id);
      // Prevent sign in without email verification
      // if (!existingUser?.isEmailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      //     existingUser.id
      //   );
      //   if (!twoFactorConfirmation) return false;
      //   // Delete two factor confirmation for next sign in
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id },
      //   });
      // }
      console.log(existingUser?.isEmailVerified);
      return true;
    },
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // session.user.role = token.role as UserRole;
        // session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        // session.user.email = token.email;
        // session.user.isOAuth = token.isOAuth as boolean;
      }
      console.log({ session });
      return session;
    },
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: 'jwt' },
  ...authConfig,
});
