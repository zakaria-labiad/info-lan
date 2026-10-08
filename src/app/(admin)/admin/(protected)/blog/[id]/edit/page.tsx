import type { JSONContent } from "@tiptap/react";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { BlogEditor, type BlogDraft } from "@/components/admin/blog";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

function toLocalDateTime(value: Date | null) {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const [post, categories, tags, media] = await Promise.all([
    prisma.blogPost.findFirst({ where: { id, deletedAt: null }, include: { translations: true, categories: true, tags: true, media: true } }),
    prisma.blogCategory.findMany({ where: { isActive: true, deletedAt: null }, select: { id: true, nameFr: true, nameEn: true }, orderBy: { sortOrder: "asc" } }),
    prisma.blogTag.findMany({ where: { deletedAt: null }, select: { id: true, nameFr: true, nameEn: true }, orderBy: { nameFr: "asc" } }),
    prisma.media.findMany({ where: { deletedAt: null, mimeType: { startsWith: "image/" } }, select: { id: true, secureUrl: true, fileName: true, altTextFr: true, altTextEn: true }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!post) notFound();
  const translation = (key: "FR" | "EN") => post.translations.find((item) => item.locale === key);
  const makeTranslation = (key: "FR" | "EN") => {
    const value = translation(key);
    return {
      title: value?.title ?? "",
      slug: value?.slug ?? "",
      subtitle: value?.subtitle ?? "",
      excerpt: value?.excerpt ?? "",
      content: (value?.content ?? { type: "doc", content: [{ type: "paragraph" }] }) as JSONContent,
      seoTitle: value?.seoTitle ?? "",
      seoDescription: value?.seoDescription ?? "",
      isReady: value?.isReady ?? false,
    };
  };
  const initialDraft: BlogDraft = {
    status: post.status,
    scheduledAt: toLocalDateTime(post.scheduledAt),
    translations: { FR: makeTranslation("FR"), EN: makeTranslation("EN") },
    categoryIds: post.categories.map((item) => item.categoryId),
    tagIds: post.tags.map((item) => item.tagId),
    mediaIds: post.media.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.mediaId),
    coverMediaId: post.media.find((item) => item.isCover)?.mediaId ?? null,
  };
  return <BlogEditor postId={post.id} revision={post.revision} initialDraft={initialDraft} categories={categories} tags={tags} media={media} locale={locale} />;
}
