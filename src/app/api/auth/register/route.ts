import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { ADMIN_EMAIL } from "@/lib/auth";

function hashPassword(password: string, salt?: string) {
  const safeSalt = salt || crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto.pbkdf2Sync(password, safeSalt, 10_000, 64, "sha512").toString("hex");
  return { passwordHash, passwordSalt: safeSalt };
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required." }, { status: 400 });
    }

    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ success: false, message: "This email is reserved for the admin account." }, { status: 400 });
    }

    await connectDB();

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordData = hashPassword(password);
    await AdminUser.create({
      name,
      email,
      ...passwordData,
    });

    return NextResponse.json({ success: true, message: "Registration successful. Please sign in." }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
