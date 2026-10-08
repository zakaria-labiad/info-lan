import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageUsers } from "@/server/auth/permissions";
import { revokeAllUserSessions } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { z } from "zod";

const updateSchema = z.object({ isActive: z.boolean().optional(), role: z.enum(["ADMIN", "EMPLOYEE"]).optional(), name: z.string().trim().min(2).max(120).optional(), preferredLocale: z.enum(["FR", "EN"]).optional() }).refine((value) => Object.keys(value).length > 0);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const current = await getCurrentAdminUser(); if (!current) return apiError("UNAUTHENTICATED", "Authentication is required.", 401); if (!canManageUsers(current.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "Invalid user id.", 400);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("VALIDATION_ERROR", "Invalid user update.", 400, parsed.error.flatten().fieldErrors);
  if (id === current.id && (parsed.data.isActive === false || parsed.data.role === "EMPLOYEE")) return apiError("SELF_PROTECTION", "You cannot remove your own administrator access.", 400);
  const target = await prisma.user.findFirst({ where: { id, deletedAt: null } }); if (!target) return apiError("NOT_FOUND", "User not found.", 404);
  if (target.role === "ADMIN" && (parsed.data.isActive === false || parsed.data.role === "EMPLOYEE")) { const activeAdmins = await prisma.user.count({ where: { role: "ADMIN", isActive: true, deletedAt: null } }); if (activeAdmins <= 1) return apiError("LAST_ADMIN", "The last active administrator cannot be deactivated.", 400); }
  const data = await prisma.$transaction(async (tx) => { const value = await tx.user.update({ where: { id }, data: parsed.data, select: { id: true, name: true, email: true, role: true, preferredLocale: true, isActive: true } }); await tx.auditLog.create({ data: { userId: current.id, action: "UPDATE", entityType: "User", entityId: id, metadata: parsed.data, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } }); return value; });
  if (parsed.data.isActive === false || parsed.data.role) await revokeAllUserSessions(id);
  return NextResponse.json({ data });
}
