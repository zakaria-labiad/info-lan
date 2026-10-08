import { getLocale } from "next-intl/server";
import { ProductEditor } from "@/components/admin/products";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function NewProductPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const localeKey = locale === "fr" ? "FR" : "EN";
  const [categoryRows, productRows, media] = await Promise.all([
    prisma.productCategory.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { deletedAt: null }, include: { translations: true }, orderBy: { sortOrder: "asc" } }),
    prisma.media.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);
  return <ProductEditor productId={null} revision={1} locale={locale} categories={categoryRows.map((item) => ({ id: item.id, name: locale === "fr" ? item.nameFr : item.nameEn }))} products={productRows.map((item) => ({ id: item.id, name: item.translations.find((translation) => translation.locale === localeKey)?.title ?? `#${item.id}` }))} media={media} />;
}
