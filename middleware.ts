import { authMiddleware } from '@clerk/nextjs';
// import i18n from "./i18n";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware

export default authMiddleware({
  publicRoutes: ['/', '/api/uploadthing', '/settings', '/api/load-multiples'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*),'],
};
