type RichTextDocument = { type?: unknown; content?: unknown };

export { slugifyBlogTitle } from "@/lib/admin/blog";

function documentText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) return value.map(documentText).join(" ");
  const record = value as Record<string, unknown>;
  return `${typeof record.text === "string" ? record.text : ""} ${documentText(record.content)}`.trim();
}

export function isLocaleReady(translation: {
  title: string;
  slug: string;
  excerpt: string | null | undefined;
  content: RichTextDocument;
}) {
  return Boolean(
    translation.title.trim() &&
    translation.slug.trim() &&
    translation.excerpt?.trim() &&
    translation.content.type === "doc" &&
    documentText(translation.content).trim(),
  );
}

export function isPostPubliclyVisible(
  post: {
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
    publishedAt: Date | null;
    scheduledAt: Date | null;
    isReady: boolean;
  },
  now = new Date(),
) {
  if (!post.isReady) return false;
  if (post.status === "PUBLISHED") return Boolean(post.publishedAt && post.publishedAt <= now);
  return post.status === "SCHEDULED" && Boolean(post.scheduledAt && post.scheduledAt <= now);
}
