import type { Prisma } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ProductEditor, type ProductDraft } from "@/components/admin/products";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const localeKey = locale === "fr" ? "FR" : "EN";
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const [product, categoryRows, productRows, media] = await Promise.all([
    prisma.product.findFirst({ where: { id, deletedAt: null }, include: { translations: true, categories: true, relatedProducts: true, media: true } }),
    prisma.productCategory.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { id: { not: id }, deletedAt: null }, include: { translations: true }, orderBy: { sortOrder: "asc" } }),
    prisma.media.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!product) notFound();
  const value = (key: "FR" | "EN") => product.translations.find((item) => item.locale === key);
  const translation = (key: "FR" | "EN") => ({ title: value(key)?.title ?? "", slug: value(key)?.slug ?? "", shortDescription: value(key)?.shortDescription ?? "", description: value(key)?.description ?? "", seoTitle: value(key)?.seoTitle ?? "", seoDescription: value(key)?.seoDescription ?? "", isReady: value(key)?.isReady ?? false });
  const initialDraft: ProductDraft = { status: product.status as ProductDraft["status"], family: product.family ?? "", availability: product.availability ?? "", isBestSeller: product.isBestSeller, sortOrder: product.sortOrder, specifications: (product.specifications ?? []) as Prisma.JsonArray as { name: string; value: string }[], options: (product.options ?? []) as Prisma.JsonArray as string[], translations: { FR: translation("FR"), EN: translation("EN") }, categoryIds: product.categories.map((item) => item.categoryId), relatedProductIds: product.relatedProducts.map((item) => item.targetProductId), mediaIds: product.media.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.mediaId) };
  return <ProductEditor productId={product.id} revision={product.revision} initialDraft={initialDraft} locale={locale} categories={categoryRows.map((item) => ({ id: item.id, name: locale === "fr" ? item.nameFr : item.nameEn }))} products={productRows.map((item) => ({ id: item.id, name: item.translations.find((translation) => translation.locale === localeKey)?.title ?? `#${item.id}` }))} media={media} />;
}
