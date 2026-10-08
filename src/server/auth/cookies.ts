import type { NextResponse } from "next/server";

export const ACCESS_COOKIE = "chelbab_admin_access";
export const REFRESH_COOKIE = "chelbab_admin_refresh";

type SessionTokens = { accessToken: string; refreshToken: string };

export function applySessionCookies(
  response: NextResponse,
  tokens: SessionTokens,
  rememberMe = true,
) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/api/admin/auth",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    path: "/api/admin/auth",
    maxAge: 0,
  });
}
