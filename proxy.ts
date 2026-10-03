import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/monitor/token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await isValidSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/monitor/login";

  if (!authed && !isLogin) {
    return NextResponse.redirect(new URL("/monitor/login", request.url));
  }
  if (authed && isLogin) {
    return NextResponse.redirect(new URL("/monitor", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/monitor", "/monitor/:path*"],
};
