import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The OAuth callback receives its token before the client has stored the session.
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const locale = routing.locales.find(
    (candidate) => pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)
  );

  const protectedRoute = routing.locales.some(
    (candidate) =>
      pathname.startsWith(`/${candidate}/creator`) ||
      pathname.startsWith(`/${candidate}/advertiser`)
  );

  // This only controls page rendering. The Main Backend remains the authorization boundary.
  const tokenInUrl = request.nextUrl.searchParams.get("token");
  if (protectedRoute && !request.cookies.get("authToken")?.value && !tokenInUrl) {
    return NextResponse.redirect(
      new URL(`/${locale || routing.defaultLocale}/login`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
