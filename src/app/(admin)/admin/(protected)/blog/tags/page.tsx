import { getLocale } from "next-intl/server";

import { TaxonomyManager } from "@/components/admin/blog";
import { PageHeader } from "@/components/admin/shared";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function BlogTagsPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const items = await prisma.blogTag.findMany({ where: { deletedAt: null }, orderBy: { nameFr: "asc" } });
  return <><PageHeader title={locale === "fr" ? "Tags du blog" : "Blog tags"} description={locale === "fr" ? "Gérez les mots-clés bilingues des articles." : "Manage bilingual post tags."} /><TaxonomyManager kind="tags" items={items} locale={locale} /></>;
}
