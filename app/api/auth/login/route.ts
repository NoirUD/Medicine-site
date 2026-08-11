import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !verifyPassword(body.password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
  return response;
}
