import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN, verifyAdminCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!verifyAdminCredentials(email, password)) {
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
