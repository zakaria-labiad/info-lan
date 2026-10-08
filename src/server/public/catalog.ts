import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/server/db/prisma";

async function queryCategory(slug: string, locale: "fr" | "en") {
  const localeKey = locale === "fr" ? "FR" : "EN";
  const category = await prisma.productCategory.findFirst({
    where: { deletedAt: null, isActive: true, ...(locale === "fr" ? { slugFr: slug } : { slugEn: slug }) },
    include: { products: { where: { product: { status: "PUBLISHED", deletedAt: null, translations: { some: { locale: localeKey, isReady: true } } } }, include: { product: { include: { translations: { where: { locale: localeKey, isReady: true } }, media: { include: { media: true }, orderBy: { sortOrder: "asc" } } } } }, orderBy: { sortOrder: "asc" } } },
  }).catch(() => null);
  if (!category) return null;
  return { name: locale === "fr" ? category.nameFr : category.nameEn, description: locale === "fr" ? category.descriptionFr : category.descriptionEn, products: category.products.flatMap(({ product }) => { const translation = product.translations[0]; if (!translation) return []; return [{ id: translation.slug, title: translation.title, description: translation.shortDescription ?? translation.description ?? "", family: product.family ?? "custom", imageSrc: product.media[0]?.media.secureUrl ?? null, imageAlt: (locale === "fr" ? product.media[0]?.media.altTextFr : product.media[0]?.media.altTextEn) ?? translation.title, isBestSeller: product.isBestSeller, availability: product.availability === "unavailable" ? "unavailable" as const : "active" as const }]; }) };
}

async function queryProduct(slug: string, locale: "fr" | "en") {
  const localeKey = locale === "fr" ? "FR" : "EN";
  const product = await prisma.product.findFirst({ where: { status: "PUBLISHED", deletedAt: null, translations: { some: { locale: localeKey, slug, isReady: true } } }, include: { translations: { where: { locale: localeKey, slug, isReady: true } }, media: { include: { media: true }, orderBy: { sortOrder: "asc" } }, categories: { include: { category: true }, orderBy: { sortOrder: "asc" } } } }).catch(() => null);
  const translation = product?.translations[0]; if (!product || !translation) return null;
  return { id: product.id, title: translation.title, description: translation.description ?? translation.shortDescription ?? "", shortDescription: translation.shortDescription ?? "", seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, family: product.family, availability: product.availability, specifications: product.specifications, options: product.options, images: product.media.map(({ media }) => ({ src: media.secureUrl, alt: (locale === "fr" ? media.altTextFr : media.altTextEn) ?? translation.title })), categoryName: product.categories[0] ? (locale === "fr" ? product.categories[0].category.nameFr : product.categories[0].category.nameEn) : null };
}

export const getPublishedCatalogCategory = unstable_cache(queryCategory, ["published-catalog-category"], { revalidate: 300, tags: ["catalog"] });
export const getPublishedCatalogProduct = unstable_cache(queryProduct, ["published-catalog-product"], { revalidate: 300, tags: ["catalog"] });
