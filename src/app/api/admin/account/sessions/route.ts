import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/server/auth/cookies";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { revokeAllUserSessions } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
export async function DELETE(request: NextRequest) { if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403); const current = await getCurrentAdminUser(); if (!current) return apiError("UNAUTHENTICATED", "Authentication is required.", 401); await revokeAllUserSessions(current.id); await prisma.auditLog.create({ data: { userId: current.id, action: "SESSION_REVOKE", entityType: "User", entityId: current.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } }); const response = NextResponse.json({ data: { success: true } }); clearSessionCookies(response); return response; }
