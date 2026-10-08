import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  applySessionCookies,
  clearSessionCookies,
  REFRESH_COOKIE,
} from "@/server/auth/cookies";
import { rotateSession } from "@/server/auth/session";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return apiError("UNAUTHENTICATED", "Authentication required.", 401);

  const tokens = await rotateSession(refreshToken, {
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  if (!tokens) {
    const response = apiError("INVALID_SESSION", "Session is no longer valid.", 401);
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({ data: { success: true } });
  applySessionCookies(response, tokens, true);
  return response;
}
