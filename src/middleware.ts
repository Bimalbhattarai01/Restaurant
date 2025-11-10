import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN } from "@/lib/auth/config";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (token !== ADMIN_SESSION_TOKEN) {
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (token === ADMIN_SESSION_TOKEN) {
      const redirectTarget = req.nextUrl.searchParams.get("redirect") || "/dashboard";
      return NextResponse.redirect(new URL(redirectTarget, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
