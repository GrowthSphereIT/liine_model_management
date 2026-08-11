import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createToken, verifyToken, SESSION_MAX_AGE_S } from "./session-token";

/**
 * Reserved-area session helpers. Wraps the stateless token in an httpOnly
 * cookie and validates the single admin password.
 */

export const SESSION_COOKIE = "liine_admin";

/** Constant-time check of the submitted password against ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both sides so timingSafeEqual gets equal-length buffers regardless
  // of input length.
  const key = "liine-pw";
  const a = createHmac("sha256", key).update(input).digest();
  const b = createHmac("sha256", key).update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** True when the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}
