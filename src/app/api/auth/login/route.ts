import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, verifyAdminCredentials } from "@/lib/auth";

function hashPassword(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10_000, 64, "sha512", (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey.toString("hex"));
    });
  });
}

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
  try {
    const { email, password } = await req.json();

    const isEnvAdmin = verifyAdminCredentials(email, password);
    let isRegisteredAdmin = false;

    if (!isEnvAdmin) {
      await connectDB();
      const existingDoc = await AdminUser.findOne({ email }).select("passwordSalt passwordHash").lean().exec();
      const existing = Array.isArray(existingDoc) ? existingDoc[0] : existingDoc;
      if (existing?.passwordSalt && existing?.passwordHash) {
        const computedHash = await hashPassword(password, existing.passwordSalt);
        isRegisteredAdmin = computedHash === existing.passwordHash;
      }
    }

    if (!isEnvAdmin && !isRegisteredAdmin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    const secureCookie = process.env.NODE_ENV === "production" && isHttpsRequest(req) && !isLocalhostRequest(req);
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, {
      httpOnly: true,
      sameSite: secureCookie ? "strict" : "lax",
      secure: secureCookie,
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
