import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless signed session token (HMAC-SHA256), no external dependency.
 *
 * Kept free of `next/headers` so it can run in both the Proxy (route guard)
 * and Server Actions / the Data Access Layer. Format: base64url(payload).sig
 */

const SECRET = process.env.SESSION_SECRET || "insecure-dev-secret";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  /** Marks an authenticated admin session. */
  admin: true;
  /** Expiry, epoch seconds. */
  exp: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(data: string): string {
  return b64url(createHmac("sha256", SECRET).update(data).digest());
}

export function createToken(): string {
  const payload: SessionPayload = {
    admin: true,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_S,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;

  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    ) as SessionPayload;
    return payload.admin === true && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
