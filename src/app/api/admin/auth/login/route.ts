import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { applySessionCookies } from "@/server/auth/cookies";
import { verifyPassword } from "@/server/auth/password";
import { createSession } from "@/server/auth/session";
import { loginInputSchema } from "@/server/auth/validation";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin, hashPrivateValue } from "@/server/http/api";

const MAX_FAILURES = 5;
const BLOCK_MINUTES = 15;

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }

  const parsed = loginInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid credentials.", 400, parsed.error.flatten().fieldErrors);
  }

  const ipAddress = getClientIp(request);
  const throttleKey = hashPrivateValue(`${parsed.data.email}:${ipAddress}`);
  const throttle = await prisma.loginThrottle.findUnique({ where: { keyHash: throttleKey } });

  if (throttle?.blockedUntil && throttle.blockedUntil > new Date()) {
    return apiError("LOGIN_THROTTLED", "Too many login attempts. Try again later.", 429);
  }

  const user = await prisma.user.findFirst({
    where: { email: parsed.data.email, isActive: true, deletedAt: null },
  });
  const valid = user ? await verifyPassword(parsed.data.password, user.passcodeHash) : false;

  if (!user || !valid) {
    const nextFailureCount = (throttle?.failureCount ?? 0) + 1;
    const blockedUntil =
      nextFailureCount >= MAX_FAILURES
        ? new Date(Date.now() + BLOCK_MINUTES * 60 * 1000)
        : null;

    await prisma.loginThrottle.upsert({
      where: { keyHash: throttleKey },
      create: { keyHash: throttleKey, failureCount: nextFailureCount, blockedUntil },
      update: { failureCount: nextFailureCount, blockedUntil, lastAttemptAt: new Date() },
    });
    return apiError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  await prisma.loginThrottle.deleteMany({ where: { keyHash: throttleKey } });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const tokens = await createSession(user.id, user.role, {
    ipAddress,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });
  const response = NextResponse.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustResetPassword: user.mustResetPassword,
    },
  });
  applySessionCookies(response, tokens, parsed.data.rememberMe);
  return response;
}
