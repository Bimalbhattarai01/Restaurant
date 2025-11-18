import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, verifyAdminCredentials } from "@/lib/auth";

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 10_000, 64, "sha512").toString("hex");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const isEnvAdmin = verifyAdminCredentials(email, password);
    let isRegisteredAdmin = false;

    if (!isEnvAdmin) {
      await connectDB();
      const existing = await AdminUser.findOne({ email });
      if (existing) {
        const computedHash = hashPassword(password, existing.passwordSalt);
        isRegisteredAdmin = computedHash === existing.passwordHash;
      }
    }

    if (!isEnvAdmin && !isRegisteredAdmin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
