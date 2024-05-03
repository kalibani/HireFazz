import NextAuth from 'next-auth';

import { apiAuthPrefix, authRoutes, openApi, publicRoutes } from '@/routes';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req): any => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOpenApi = openApi.includes(nextUrl.pathname);

  if (isApiAuthRoute || isOpenApi) {
    return null;
  }

  if (isAuthRoute || isPublicRoute) {
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log('MASSSSSSUKKK');
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }
  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*),'],
};
