import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { forgotPasswordInputSchema } from "@/server/auth/validation";
import { hashRefreshToken } from "@/server/auth/tokens";
import { prisma } from "@/server/db/prisma";
import { apiError, hasTrustedOrigin } from "@/server/http/api";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const parsed = forgotPasswordInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Enter a valid email address.", 400, parsed.error.flatten().fieldErrors);
  const user = await prisma.user.findFirst({ where: { email: parsed.data.email, isActive: true, deletedAt: null } });
  if (user && env.RESEND_API_KEY && env.EMAIL_FROM_ADDRESS && env.PUBLIC_SITE_URL) {
    const token = randomBytes(48).toString("base64url");
    await prisma.$transaction([prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }), prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashRefreshToken(token), expiresAt: new Date(Date.now() + 60 * 60 * 1_000) } })]);
    const url = new URL("/admin/reset-password", env.PUBLIC_SITE_URL); url.searchParams.set("token", token);
    await new Resend(env.RESEND_API_KEY).emails.send({ from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`, to: user.email, subject: "Reset your INFO-L@N administrator password", text: `Reset your password: ${url.toString()}\n\nThis link expires in one hour.` });
  }
  return NextResponse.json({ data: { accepted: true } });
}
