import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hashPassword } from "@/server/auth/password";
import { revokeAllUserSessions } from "@/server/auth/session";
import { hashRefreshToken } from "@/server/auth/tokens";
import { resetPasswordInputSchema } from "@/server/auth/validation";
import { prisma } from "@/server/db/prisma";
import { apiError, hasTrustedOrigin } from "@/server/http/api";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const parsed = resetPasswordInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "The reset request is invalid.", 400, parsed.error.flatten().fieldErrors);
  const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashRefreshToken(parsed.data.token) } });
  if (!reset || reset.usedAt || reset.expiresAt <= new Date()) return apiError("INVALID_RESET_TOKEN", "This reset link is invalid or expired.", 400);
  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction([prisma.user.update({ where: { id: reset.userId }, data: { passcodeHash: passwordHash, mustResetPassword: false } }), prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } })]);
  await revokeAllUserSessions(reset.userId);
  return NextResponse.json({ data: { success: true } });
}
