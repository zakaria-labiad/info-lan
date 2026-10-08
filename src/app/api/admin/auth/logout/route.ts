import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clearSessionCookies, REFRESH_COOKIE } from "@/server/auth/cookies";
import { revokeRefreshToken } from "@/server/auth/session";
import { apiError, hasTrustedOrigin } from "@/server/http/api";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) await revokeRefreshToken(refreshToken);

  const response = NextResponse.json({ data: { success: true } });
  clearSessionCookies(response);
  return response;
}
