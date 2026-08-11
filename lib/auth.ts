import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function verifyPassword(password: string): boolean {
  return password === getSecret();
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp: number;
    };
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export { SESSION_COOKIE, SESSION_TTL_MS };
