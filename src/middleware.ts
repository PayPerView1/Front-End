import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const locale = routing.locales.find(
    (candidate) => pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`),
  );
  const protectedRoute = routing.locales.some(
    (candidate) => pathname.startsWith(`/${candidate}/dashboard`) || pathname.startsWith(`/${candidate}/edit-profile`),
  );

  if (protectedRoute && !request.cookies.get("authToken")?.value) {
    return NextResponse.redirect(new URL(`/${locale || routing.defaultLocale}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
