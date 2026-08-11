import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/session-token";
import { SESSION_COOKIE } from "@/lib/auth";

const LOGIN_PATH = "/riservato/login";

/**
 * Guards the reserved area. Optimistic cookie check only — every mutation in
 * the area also re-verifies the session server-side. Redirects unauthenticated
 * visitors to the login, and bounces authenticated ones away from it.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === LOGIN_PATH;

  if (!authed && !isLogin) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (authed && isLogin) {
    return NextResponse.redirect(new URL("/riservato", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/riservato/:path*"],
};
