import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageBlogPosts } from "@/server/auth/permissions";
import { blogCategoryInputSchema } from "@/server/blog/taxonomy";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

type Context = { params: Promise<{ id: string }> };

async function authorize(request: NextRequest, context: Context) {
  if (!hasTrustedOrigin(request)) return { error: apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403) };
  const user = await getCurrentAdminUser();
  if (!user) return { error: apiError("UNAUTHENTICATED", "Authentication is required.", 401) };
  if (!canManageBlogPosts(user.role)) return { error: apiError("FORBIDDEN", "Permission denied.", 403) };
  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id < 1) return { error: apiError("INVALID_ID", "Invalid category id.", 400) };
  return { user, id };
}

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await authorize(request, context);
  if ("error" in auth) return auth.error;
  const parsed = blogCategoryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  try {
    const data = await prisma.$transaction(async (tx) => {
      const category = await tx.blogCategory.update({ where: { id: auth.id }, data: parsed.data });
      await tx.auditLog.create({ data: { userId: auth.user.id, action: "UPDATE", entityType: "BlogCategory", entityId: auth.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } });
      return category;
    });
    return NextResponse.json({ data });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return apiError("NOT_FOUND", "Category not found.", 404);
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("SLUG_CONFLICT", "A category already uses this slug.", 409);
    throw error;
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const auth = await authorize(request, context);
  if ("error" in auth) return auth.error;
  try {
    const data = await prisma.$transaction(async (tx) => {
      const category = await tx.blogCategory.update({ where: { id: auth.id }, data: { deletedAt: new Date(), isActive: false } });
      await tx.auditLog.create({ data: { userId: auth.user.id, action: "DELETE", entityType: "BlogCategory", entityId: auth.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } });
      return category;
    });
    return NextResponse.json({ data });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return apiError("NOT_FOUND", "Category not found.", 404);
    throw error;
  }
}
