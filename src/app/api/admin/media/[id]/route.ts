import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageContent } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { getCloudinary } from "@/server/media/cloudinary";
import { canDeleteMedia } from "@/server/products/validation";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser(); if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageContent(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "Invalid media id.", 400);
  const media = await prisma.media.findFirst({ where: { id, deletedAt: null }, select: { id: true, publicId: true, _count: { select: { blogPosts: true, products: true } } } });
  if (!media) return apiError("NOT_FOUND", "Media not found.", 404);
  if (!canDeleteMedia(media._count)) return apiError("MEDIA_REFERENCED", "Detach this media before deleting it.", 409);
  const client = getCloudinary(); if (!client) return apiError("MEDIA_NOT_CONFIGURED", "Media deletion is not configured.", 503);
  await client.uploader.destroy(media.publicId, { resource_type: "image", invalidate: true });
  const data = await prisma.$transaction(async (tx) => { const value = await tx.media.update({ where: { id }, data: { deletedAt: new Date() } }); await tx.auditLog.create({ data: { userId: user.id, action: "DELETE", entityType: "Media", entityId: id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } }); return value; });
  return NextResponse.json({ data: { id: data.id, deletedAt: data.deletedAt } });
}
