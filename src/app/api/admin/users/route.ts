import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { hashPassword } from "@/server/auth/password";
import { canManageUsers } from "@/server/auth/permissions";
import { hashRefreshToken } from "@/server/auth/tokens";
import { userInputSchema } from "@/server/auth/validation";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

export async function GET() {
  const current = await getCurrentAdminUser(); if (!current) return apiError("UNAUTHENTICATED", "Authentication is required.", 401); if (!canManageUsers(current.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const data = await prisma.user.findMany({ where: { deletedAt: null }, select: { id: true, name: true, email: true, role: true, preferredLocale: true, isActive: true, mustResetPassword: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } });
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const current = await getCurrentAdminUser(); if (!current) return apiError("UNAUTHENTICATED", "Authentication is required.", 401); if (!canManageUsers(current.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const parsed = userInputSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  const temporaryPassword = randomBytes(32).toString("base64url"); const resetToken = randomBytes(48).toString("base64url");
  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({ data: { ...parsed.data, passcodeHash: await hashPassword(temporaryPassword), mustResetPassword: true } });
      await tx.passwordResetToken.create({ data: { userId: created.id, tokenHash: hashRefreshToken(resetToken), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1_000) } });
      await tx.auditLog.create({ data: { userId: current.id, action: "CREATE", entityType: "User", entityId: created.id, metadata: { role: created.role }, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } }); return created;
    });
    let invitationSent = false;
    if (env.RESEND_API_KEY && env.EMAIL_FROM_ADDRESS && env.PUBLIC_SITE_URL) { const url = new URL("/admin/reset-password", env.PUBLIC_SITE_URL); url.searchParams.set("token", resetToken); const result = await new Resend(env.RESEND_API_KEY).emails.send({ from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`, to: user.email, subject: "Your INFO-L@N administrator account", text: `Set your initial password: ${url.toString()}\n\nThis link expires in 24 hours.` }); invitationSent = Boolean(result.data); }
    return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role, invitationSent } }, { status: 201 });
  } catch (error) { if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("EMAIL_CONFLICT", "A user already uses this email.", 409); throw error; }
}
