import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

function isLocalhostRequest(req: Request) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function isHttpsRequest(req: Request) {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim().toLowerCase() === "https";
  return req.url.startsWith("https://");
}

export async function POST(req: Request) {
  const secureCookie = process.env.NODE_ENV === "production" && isHttpsRequest(req) && !isLocalhostRequest(req);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: secureCookie ? "strict" : "lax",
    secure: secureCookie,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
