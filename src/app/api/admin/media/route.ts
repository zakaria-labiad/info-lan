import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageContent } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { getCloudinary } from "@/server/media/cloudinary";
import { mediaRegistrationSchema } from "@/server/products/validation";

export async function GET() {
  const user = await getCurrentAdminUser(); if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageContent(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const data = await prisma.media.findMany({ where: { deletedAt: null }, select: { id: true, publicId: true, secureUrl: true, fileName: true, mimeType: true, width: true, height: true, altTextFr: true, altTextEn: true, createdAt: true, _count: { select: { blogPosts: true, products: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } });
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser(); if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageContent(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const parsed = mediaRegistrationSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("VALIDATION_ERROR", "Invalid media metadata.", 400, parsed.error.flatten().fieldErrors);
  const client = getCloudinary(); if (!client) return apiError("MEDIA_NOT_CONFIGURED", "Media uploads are not configured.", 503);
  try {
    const asset = await client.api.resource(parsed.data.publicId, { resource_type: "image" });
    if (!asset.secure_url || !asset.bytes || asset.bytes > 8 * 1024 * 1024) return apiError("INVALID_MEDIA", "Uploaded media is not allowed.", 400);
    const format = String(asset.format).toLowerCase(); if (!["jpg", "jpeg", "png", "webp", "avif"].includes(format)) return apiError("INVALID_MEDIA", "Uploaded media type is not allowed.", 400);
    const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
    const media = await prisma.$transaction(async (tx) => {
      const value = await tx.media.upsert({ where: { publicId: parsed.data.publicId }, create: { publicId: parsed.data.publicId, secureUrl: asset.secure_url, fileName: asset.original_filename ?? parsed.data.publicId.split("/").at(-1) ?? "image", fileSize: BigInt(asset.bytes), mimeType, width: asset.width, height: asset.height, altTextFr: parsed.data.altTextFr || null, altTextEn: parsed.data.altTextEn || null, uploadedById: user.id }, update: { secureUrl: asset.secure_url, fileSize: BigInt(asset.bytes), mimeType, width: asset.width, height: asset.height, altTextFr: parsed.data.altTextFr || null, altTextEn: parsed.data.altTextEn || null, deletedAt: null } });
      await tx.auditLog.create({ data: { userId: user.id, action: "CREATE", entityType: "Media", entityId: value.id, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } }); return value;
    });
    return NextResponse.json({ data: { ...media, fileSize: media.fileSize?.toString() ?? null } }, { status: 201 });
  } catch (error) { return apiError("MEDIA_LOOKUP_FAILED", error instanceof Error ? error.message : "Media verification failed.", 502); }
}
