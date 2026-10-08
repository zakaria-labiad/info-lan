import { getLocale } from "next-intl/server";

import { TaxonomyManager } from "@/components/admin/blog";
import { PageHeader } from "@/components/admin/shared";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function BlogCategoriesPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const items = await prisma.blogCategory.findMany({ where: { deletedAt: null }, orderBy: [{ sortOrder: "asc" }, { nameFr: "asc" }] });
  return <><PageHeader title={locale === "fr" ? "Catégories du blog" : "Blog categories"} description={locale === "fr" ? "Organisez les articles dans des catégories bilingues." : "Organize posts into bilingual categories."} /><TaxonomyManager kind="categories" items={items} locale={locale} /></>;
}
