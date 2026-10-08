import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageProducts } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { productInputSchema } from "@/server/products/validation";

export async function GET() {
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageProducts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const data = await prisma.product.findMany({ where: { deletedAt: null }, include: { translations: true }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json({ data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } });
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageProducts(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const parsed = productInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  const input = parsed.data;
  if (input.status === "PUBLISHED" && !Object.values(input.translations).some((item) => item.isReady && item.title && item.slug && item.description)) return apiError("NO_READY_LOCALE", "At least one complete locale is required to publish.", 400);
  try {
    const data = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          status: input.status,
          family: input.family || null,
          availability: input.availability || null,
          isBestSeller: input.isBestSeller,
          sortOrder: input.sortOrder,
          specifications: input.specifications as Prisma.InputJsonValue,
          options: input.options as Prisma.InputJsonValue,
          publishedAt: input.status === "PUBLISHED" ? new Date() : null,
          createdById: user.id,
          updatedById: user.id,
          translations: { create: (["FR", "EN"] as const).map((locale) => ({ locale, ...input.translations[locale] })) },
          categories: { create: input.categoryIds.map((categoryId, sortOrder) => ({ categoryId, sortOrder })) },
          relatedProducts: { create: input.relatedProductIds.map((targetProductId, sortOrder) => ({ targetProductId, sortOrder })) },
          media: { create: input.mediaIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder, isPrimary: sortOrder === 0 })) },
        },
        include: { translations: true, categories: true, relatedProducts: true, media: true },
      });
      await tx.auditLog.create({ data: { userId: user.id, action: "CREATE", entityType: "Product", entityId: product.id, metadata: { status: product.status }, ipAddress: getClientIp(request), userAgent: request.headers.get("user-agent") } });
      return product;
    });
    revalidatePath("/fr/categories"); revalidatePath("/en/categories"); revalidateTag("catalog", "max");
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return apiError("SLUG_CONFLICT", "A product already uses one of these slugs.", 409);
    throw error;
  }
}
