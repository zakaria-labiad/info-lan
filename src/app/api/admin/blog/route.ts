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

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);

  const data = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    include: { translations: true, creator: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } });
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageBlogPosts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);

  const parsed = blogPostInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  }
  const input = parsed.data;
  const ready = (["FR", "EN"] as const).map((locale) => ({
    locale,
    valid: isLocaleReady(input.translations[locale]),
    requested: input.translations[locale].isReady,
  }));
  if (ready.some((item) => item.requested && !item.valid)) {
    return apiError("LOCALE_NOT_READY", "A ready translation is missing required content.", 400);
  }
  if (["PUBLISHED", "SCHEDULED"].includes(input.status) && !ready.some((item) => item.requested && item.valid)) {
    return apiError("NO_READY_LOCALE", "At least one complete locale is required to publish.", 400);
  }
  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : null;
  if (input.status === "SCHEDULED" && (!scheduledAt || scheduledAt <= new Date())) {
    return apiError("INVALID_SCHEDULE", "Scheduled publication must be in the future.", 400);
  }
  const availableMedia = await prisma.media.count({ where: { id: { in: input.mediaIds }, deletedAt: null } });
  if (availableMedia !== input.mediaIds.length) return apiError("INVALID_MEDIA", "One or more media items are unavailable.", 400);

  try {
    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.blogPost.create({
        data: {
          status: input.status,
          scheduledAt,
          publishedAt: input.status === "PUBLISHED" ? new Date() : null,
          createdById: user.id,
          updatedById: user.id,
          translations: {
            create: (["FR", "EN"] as const).map((locale) => ({
              locale,
              ...input.translations[locale],
              content: input.translations[locale].content as Prisma.InputJsonValue,
            })),
          },
          categories: { create: input.categoryIds.map((categoryId, sortOrder) => ({ categoryId, sortOrder })) },
          tags: { create: input.tagIds.map((tagId) => ({ tagId })) },
          media: { create: input.mediaIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder, isCover: mediaId === input.coverMediaId })) },
        },
        include: { translations: true, categories: true, tags: true, media: true },
      });
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE",
          entityType: "BlogPost",
          entityId: created.id,
          metadata: { status: created.status },
          ipAddress: getClientIp(request),
          userAgent: request.headers.get("user-agent"),
        },
      });
      return created;
    });
    revalidatePath("/fr/resources/blog");
    revalidatePath("/en/resources/blog");
    revalidateTag("blog", "max");
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return apiError("SLUG_CONFLICT", "A post already uses one of these slugs.", 409);
    }
    throw error;
  }
}
