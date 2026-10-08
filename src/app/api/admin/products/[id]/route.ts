import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageProducts } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { productInputSchema } from "@/server/products/validation";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageProducts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "Invalid product id.", 400);
  const parsed = productInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  const input = parsed.data;
  if (input.relatedProductIds.includes(id)) return apiError("INVALID_RELATION", "A product cannot relate to itself.", 400);
  if (input.status === "PUBLISHED" && !Object.values(input.translations).some((item) => item.isReady && item.title && item.slug && item.description)) return apiError("NO_READY_LOCALE", "At least one complete locale is required to publish.", 400);
  try {
    const data = await prisma.$transaction(async (tx) => {
      const changed = await tx.product.updateMany({ where: { id, revision: input.revision, deletedAt: null }, data: { status: input.status, family: input.family || null, availability: input.availability || null, isBestSeller: input.isBestSeller, sortOrder: input.sortOrder, specifications: input.specifications as Prisma.InputJsonValue, options: input.options as Prisma.InputJsonValue, publishedAt: input.status === "PUBLISHED" ? new Date() : input.status === "DRAFT" ? null : undefined, updatedById: user.id, revision: { increment: 1 } } });
      if (changed.count !== 1) return null;
      for (const locale of ["FR", "EN"] as const) await tx.productTranslation.upsert({ where: { productId_locale: { productId: id, locale } }, create: { productId: id, locale, ...input.translations[locale] }, update: input.translations[locale] });
      await tx.productCategoryAssignment.deleteMany({ where: { productId: id } });
      if (input.categoryIds.length) await tx.productCategoryAssignment.createMany({ data: input.categoryIds.map((categoryId, sortOrder) => ({ productId: id, categoryId, sortOrder })) });
      await tx.productRelation.deleteMany({ where: { sourceProductId: id } });
      if (input.relatedProductIds.length) await tx.productRelation.createMany({ data: input.relatedProductIds.map((targetProductId, sortOrder) => ({ sourceProductId: id, targetProductId, sortOrder })) });
      await tx.productMedia.deleteMany({ where: { productId: id } });
      if (input.mediaIds.length) await tx.productMedia.createMany({ data: input.mediaIds.map((mediaId, sortOrder) => ({ productId: id, mediaId, sortOrder, isPrimary: sortOrder === 0 })) });
      await tx.auditLog.create({ data: { userId: user.id, action: input.status === "PUBLISHED" ? "PUBLISH" : input.status === "ARCHIVED" ? "ARCHIVE" : "UPDATE", entityType: "Product", entityId: id, metadata: { revision: input.revision + 1 }, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } });
      return tx.product.findUnique({ where: { id }, include: { translations: true, categories: true, relatedProducts: true, media: true } });
    });
    if (!data) return apiError("REVISION_CONFLICT", "This product changed. Refresh and try again.", 409);
    revalidatePath("/fr/categories"); revalidatePath("/en/categories"); revalidateTag("catalog", "max");
    return NextResponse.json({ data });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("SLUG_CONFLICT", "A product already uses one of these slugs.", 409);
    throw error;
  }
}
