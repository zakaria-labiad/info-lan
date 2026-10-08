import { getLocale } from "next-intl/server";
import { TaxonomyManager } from "@/components/admin/blog";
import { PageHeader } from "@/components/admin/shared";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function ProductCategoriesPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const items = await prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: [{ sortOrder: "asc" }, { nameFr: "asc" }] });
  return <><PageHeader title={locale === "fr" ? "Catégories de produits" : "Product categories"} description={locale === "fr" ? "Gérez la taxonomie bilingue du catalogue." : "Manage the catalog’s bilingual taxonomy."} /><TaxonomyManager kind="categories" apiBase="/api/admin/product-categories" items={items} locale={locale} /></>;
}
