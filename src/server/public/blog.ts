import "server-only";

import { unstable_cache } from "next/cache";
import type { BlogPost, BlogPostBodySection } from "@/features/client/types/blog.type";
import { prisma } from "@/server/db/prisma";

const PUBLIC_BLOG_IMAGES = [
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
  "/images/about/info-lan-team.webp",
] as const;

function contentSections(content: unknown): BlogPostBodySection[] {
  const nodes = content && typeof content === "object" && "content" in content && Array.isArray((content as { content: unknown }).content) ? (content as { content: Record<string, unknown>[] }).content : [];
  const sections: BlogPostBodySection[] = [];
  let current: BlogPostBodySection = { paragraphs: [] };
  const hasContent = (section: BlogPostBodySection) => Boolean(section.heading || section.paragraphs.length || section.images?.length || section.closingParagraphs?.length);
  for (const node of nodes) {
    const text = Array.isArray(node.content) ? (node.content as { text?: string }[]).map((part) => part.text ?? "").join("") : "";
    if (node.type === "heading" && text) { if (hasContent(current)) sections.push(current); current = { heading: text, paragraphs: [] }; continue; }
    if (node.type === "image") {
      const attrs = node.attrs && typeof node.attrs === "object" ? node.attrs as Record<string, unknown> : {};
      if (typeof attrs.src === "string" && attrs.src) current.images = [...(current.images ?? []), { src: attrs.src, alt: typeof attrs.alt === "string" ? attrs.alt : "" }];
      continue;
    }
    if (!text) continue;
    if (current.images?.length) current.closingParagraphs = [...(current.closingParagraphs ?? []), text];
    else current.paragraphs.push(text);
  }
  if (hasContent(current)) sections.push(current);
  return sections.length ? sections : [{ paragraphs: [] }];
}

async function queryPublishedBlog(locale: "fr" | "en"): Promise<BlogPost[]> {
  const localeKey = locale === "fr" ? "FR" : "EN";
  const now = new Date();
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, OR: [{ status: "PUBLISHED", publishedAt: { lte: now } }, { status: "SCHEDULED", scheduledAt: { lte: now } }], translations: { some: { locale: localeKey, isReady: true } } },
    include: { translations: { where: { locale: localeKey, isReady: true } }, creator: { select: { name: true } }, categories: { include: { category: true }, orderBy: { sortOrder: "asc" } }, tags: { include: { tag: true } }, comments: { where: { locale: localeKey, status: "APPROVED", deletedAt: null }, orderBy: { createdAt: "asc" }, select: { id: true, authorName: true, body: true, createdAt: true } }, media: { where: { isCover: true }, include: { media: true }, take: 1 } },
    orderBy: { publishedAt: "desc" },
  }).catch(() => []);
  return posts.flatMap((post, index) => {
    const translation = post.translations[0]; if (!translation) return [];
    const category = post.categories[0]?.category;
    return [{ slug: translation.slug, title: translation.title, excerpt: translation.excerpt ?? "", category: category ? (locale === "fr" ? category.slugFr : category.slugEn) : "all", author: post.creator.name, date: new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(post.publishedAt ?? post.createdAt), readTime: locale === "fr" ? "6 min de lecture" : "6 min read", image: post.media[0]?.media.secureUrl ?? PUBLIC_BLOG_IMAGES[index % PUBLIC_BLOG_IMAGES.length], imageAlt: translation.title, body: contentSections(translation.content), quote: { text: translation.subtitle ?? translation.excerpt ?? "", author: "INFO-L@N", role: locale === "fr" ? "Conseil informatique" : "IT guidance" }, relatedTags: post.tags.map(({ tag }) => locale === "fr" ? tag.nameFr : tag.nameEn), authorProfile: { name: post.creator.name, image: "/images/about/info-lan-team.webp", imageAlt: post.creator.name, bio: locale === "fr" ? "L’équipe INFO-L@N partage des conseils sur le matériel, l’installation et la maintenance." : "The INFO-L@N team shares guidance on equipment, installation, and maintenance.", socials: [] }, comments: post.comments.map((comment) => ({ id: String(comment.id), author: comment.authorName, date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(comment.createdAt), image: "/images/about/info-lan-team.webp", imageAlt: comment.authorName, body: comment.body })) }];
  });
}

export const getPublishedBlogPosts = unstable_cache(queryPublishedBlog, ["published-blog-posts"], { revalidate: 300, tags: ["blog"] });
