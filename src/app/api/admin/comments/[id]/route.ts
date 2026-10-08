import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageBlogPosts } from "@/server/auth/permissions";
import { commentModerationSchema } from "@/server/blog/comments";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "The comment id is invalid.", 400);
  const parsed = commentModerationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Invalid moderation status.", 400, parsed.error.flatten().fieldErrors);
  const comment = await prisma.blogComment.findFirst({ where: { id, deletedAt: null }, include: { post: { include: { translations: true } } } });
  if (!comment) return apiError("NOT_FOUND", "Comment not found.", 404);

  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const value = await tx.blogComment.update({
      where: { id },
      data: {
        status: parsed.data.status,
        moderatedById: user.id,
        moderatedAt: now,
        ...(parsed.data.status === "DELETED" ? { deletedAt: now } : {}),
      },
    });
    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "MODERATE",
        entityType: "BlogComment",
        entityId: id,
        metadata: { previousStatus: comment.status, status: parsed.data.status },
        ipAddress: getClientIp(request),
        userAgent: request.headers.get("user-agent"),
      },
    });
    return value;
  });
  for (const translation of comment.post.translations) revalidatePath(`/${translation.locale.toLowerCase()}/resources/blog/${translation.slug}`);
  revalidateTag("blog", "max");
  return NextResponse.json({ data: updated });
}
