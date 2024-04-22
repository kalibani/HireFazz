import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  openApi,
  publicRoutes,
} from '@/routes';

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
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    //   let callbackUrl = nextUrl.pathname;
    //   if (nextUrl.search) {
    //     callbackUrl += nextUrl.search;
    //   }
    //   const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    //   console.log({ encodedCallbackUrl, callbackUrl });
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }
  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*),'],
};
