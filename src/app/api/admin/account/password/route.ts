import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { revokeAllUserSessions } from "@/server/auth/session";
import { accountPasswordSchema } from "@/server/auth/validation";
import { clearSessionCookies } from "@/server/auth/cookies";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
export async function POST(request: NextRequest) { if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403); const current = await getCurrentAdminUser(); if (!current) return apiError("UNAUTHENTICATED", "Authentication is required.", 401); const parsed = accountPasswordSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the password fields.", 400, parsed.error.flatten().fieldErrors); const user = await prisma.user.findUnique({ where: { id: current.id } }); if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passcodeHash))) return apiError("INVALID_PASSWORD", "Current password is incorrect.", 400); const password = await hashPassword(parsed.data.newPassword); await prisma.$transaction([prisma.user.update({ where: { id: current.id }, data: { passcodeHash: password, mustResetPassword: false } }), prisma.auditLog.create({ data: { userId: current.id, action: "UPDATE", entityType: "UserPassword", entityId: current.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } })]); await revokeAllUserSessions(current.id); const response = NextResponse.json({ data: { success: true } }); clearSessionCookies(response); return response; }
