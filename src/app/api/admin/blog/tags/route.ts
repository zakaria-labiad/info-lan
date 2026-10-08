import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageBlogPosts } from "@/server/auth/permissions";
import { blogTagInputSchema } from "@/server/blog/taxonomy";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const data = await prisma.blogTag.findMany({ where: { deletedAt: null }, orderBy: { nameFr: "asc" } });
  return NextResponse.json({ data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } });
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const parsed = blogTagInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  try {
    const data = await prisma.$transaction(async (tx) => {
      const tag = await tx.blogTag.create({ data: parsed.data });
      await tx.auditLog.create({ data: { userId: user.id, action: "CREATE", entityType: "BlogTag", entityId: tag.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } });
      return tag;
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("SLUG_CONFLICT", "A tag already uses this slug.", 409);
    throw error;
  }
}
