import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TOKEN,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  verifyAdminCredentials,
  isSessionTokenValid,
} from "@/lib/auth/config";

export {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TOKEN,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  verifyAdminCredentials,
  isSessionTokenValid,
};

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return isSessionTokenValid(token);
}

export function adminUnauthorizedResponse() {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
