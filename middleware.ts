import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import i18n from "./i18n";
// import i18n from "./i18n";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
	beforeAuth: (request) => {
		const locale = request.nextUrl.locale || i18n.defaultLocale;
		request.nextUrl.searchParams.set("lang", locale);
		request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, "");
		return NextResponse.rewrite(request.nextUrl);
	},
	publicRoutes: ["/", "/api/uploadthing", "/settings", "/api/load-multiples"],
});

// export function middleware(request: NextRequest) {
// 	const locale = request.nextUrl.locale || i18n.defaultLocale;
// 	request.nextUrl.searchParams.set("lang", locale);
// 	request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, "");
// 	return NextResponse.rewrite(request.nextUrl);
// }

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*),"],
};
