import { NextResponse } from "next/server";
import {
  createSessionToken,
  isAuthConfigured,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  verifyPassword,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${ip}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);

  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSec) },
      },
    );
  }

  if (!isAuthConfigured()) {
    console.error("Admin auth is not configured correctly");
    return NextResponse.json(
      {
        error:
          "Авторизация не настроена. Проверьте ADMIN_PASSWORD_HASH и SESSION_SECRET в .env.local (хеш bcrypt нужно брать в одинарные кавычки).",
      },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  if (!body.password || !(await verifyPassword(body.password))) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
  return response;
}
