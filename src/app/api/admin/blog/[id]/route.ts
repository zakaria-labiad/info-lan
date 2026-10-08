import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageBlogPosts } from "@/server/auth/permissions";
import { isLocaleReady } from "@/server/blog/publication";
import { blogPostInputSchema } from "@/server/blog/validation";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "The post id is invalid.", 400);
  const data = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    include: { translations: true, categories: true, tags: true, media: { include: { media: true } } },
  });
  if (!data) return apiError("NOT_FOUND", "Post not found.", 404);
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "The post id is invalid.", 400);
  const parsed = blogPostInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  const input = parsed.data;
  const existing = await prisma.blogPost.findFirst({ where: { id, deletedAt: null }, select: { revision: true } });
  if (!existing) return apiError("NOT_FOUND", "Post not found.", 404);
  if (existing.revision !== input.revision) return apiError("REVISION_CONFLICT", "This post changed. Refresh and try again.", 409);

  const ready = (["FR", "EN"] as const).map((locale) => ({ locale, valid: isLocaleReady(input.translations[locale]), requested: input.translations[locale].isReady }));
  if (ready.some((item) => item.requested && !item.valid)) return apiError("LOCALE_NOT_READY", "A ready translation is missing required content.", 400);
  if (["PUBLISHED", "SCHEDULED"].includes(input.status) && !ready.some((item) => item.requested && item.valid)) return apiError("NO_READY_LOCALE", "At least one complete locale is required to publish.", 400);
  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : null;
  if (input.status === "SCHEDULED" && (!scheduledAt || scheduledAt <= new Date())) return apiError("INVALID_SCHEDULE", "Scheduled publication must be in the future.", 400);
  const availableMedia = await prisma.media.count({ where: { id: { in: input.mediaIds }, deletedAt: null } });
  if (availableMedia !== input.mediaIds.length) return apiError("INVALID_MEDIA", "One or more media items are unavailable.", 400);

  try {
    const post = await prisma.$transaction(async (tx) => {
      const changed = await tx.blogPost.updateMany({
        where: { id, revision: input.revision, deletedAt: null },
        data: {
          status: input.status,
          scheduledAt,
          publishedAt: input.status === "PUBLISHED" ? new Date() : input.status === "DRAFT" ? null : undefined,
          updatedById: user.id,
          revision: { increment: 1 },
        },
      });
      if (changed.count !== 1) return null;
      for (const locale of ["FR", "EN"] as const) {
        const translation = input.translations[locale];
        await tx.blogPostTranslation.upsert({
          where: { postId_locale: { postId: id, locale } },
          create: { postId: id, locale, ...translation, content: translation.content as Prisma.InputJsonValue },
          update: { ...translation, content: translation.content as Prisma.InputJsonValue },
        });
      }
      await tx.blogPostCategory.deleteMany({ where: { postId: id } });
      if (input.categoryIds.length) await tx.blogPostCategory.createMany({ data: input.categoryIds.map((categoryId, sortOrder) => ({ postId: id, categoryId, sortOrder })) });
      await tx.blogPostTag.deleteMany({ where: { postId: id } });
      if (input.tagIds.length) await tx.blogPostTag.createMany({ data: input.tagIds.map((tagId) => ({ postId: id, tagId })) });
      await tx.blogPostMedia.deleteMany({ where: { postId: id } });
      if (input.mediaIds.length) await tx.blogPostMedia.createMany({ data: input.mediaIds.map((mediaId, sortOrder) => ({ postId: id, mediaId, sortOrder, isCover: mediaId === input.coverMediaId })) });
      await tx.auditLog.create({
        data: { userId: user.id, action: input.status === "PUBLISHED" ? "PUBLISH" : input.status === "ARCHIVED" ? "ARCHIVE" : "UPDATE", entityType: "BlogPost", entityId: id, metadata: { status: input.status, revision: input.revision + 1 }, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") },
      });
      return tx.blogPost.findUnique({ where: { id }, include: { translations: true, categories: true, tags: true, media: true } });
    });
    if (!post) return apiError("REVISION_CONFLICT", "This post changed. Refresh and try again.", 409);
    revalidatePath("/fr/resources/blog");
    revalidatePath("/en/resources/blog");
    revalidateTag("blog", "max");
    for (const translation of post.translations) revalidatePath(`/${translation.locale.toLowerCase()}/resources/blog/${translation.slug}`);
    return NextResponse.json({ data: post });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("SLUG_CONFLICT", "A post already uses one of these slugs.", 409);
    throw error;
  }
}
