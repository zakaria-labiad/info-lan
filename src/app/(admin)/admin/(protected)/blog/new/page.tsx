import { getLocale } from "next-intl/server";

import { BlogEditor } from "@/components/admin/blog";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function NewBlogPostPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const [categories, tags, media] = await Promise.all([
    prisma.blogCategory.findMany({ where: { isActive: true, deletedAt: null }, select: { id: true, nameFr: true, nameEn: true }, orderBy: { sortOrder: "asc" } }),
    prisma.blogTag.findMany({ where: { deletedAt: null }, select: { id: true, nameFr: true, nameEn: true }, orderBy: { nameFr: "asc" } }),
    prisma.media.findMany({ where: { deletedAt: null, mimeType: { startsWith: "image/" } }, select: { id: true, secureUrl: true, fileName: true, altTextFr: true, altTextEn: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return <BlogEditor postId={null} revision={1} categories={categories} tags={tags} media={media} locale={locale} />;
}
