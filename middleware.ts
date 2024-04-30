import NextAuth from 'next-auth';

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  openApi,
  publicRoutes,
} from '@/routes';
import { authConfig } from './auth.config';
import { routeModule } from 'next/dist/build/templates/app-page';

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
      // return Response.redirect(new URL('/111/dashboard', nextUrl));
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

// -user udah login:
// -after fetch data Organization.
// -push route dari org list ambil index 0,
// - org list masuk navbar.

// - user refresh dasboard private route...
// - fetch data org list
//
