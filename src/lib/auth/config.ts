export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "admin-session-token";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@almadofado.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "supersecret";

export function verifyAdminCredentials(email: string, password: string) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function isSessionTokenValid(token?: string | null) {
  return token === ADMIN_SESSION_TOKEN;
}
