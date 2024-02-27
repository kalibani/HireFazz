import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
	locales: ["en", "id"],
	defaultLocale: "en",
});

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
	beforeAuth: (request: NextRequest) => {
		return intlMiddleware(request);
	},

	publicRoutes: [
		"/",
		"/api/uploadthing",
		"/settings",
		"/api/load-multiples",
		"/:locale",
		"/:locale/sign-in/:path*",
		"/:locale/sign-up/:path*",
	],
});

export const config = {
	matcher: [
		"/((?!.*\\..*|_next).*)",
		"/",
		"/(api|trpc)(.*),",
		"/(id|en)/:path*",
	],
};
