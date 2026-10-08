import { z } from "zod";

export const tiptapDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.unknown()).default([]),
}).passthrough();

const translationSchema = z.object({
  title: z.string().trim().max(200),
  slug: z.string().trim().max(140).refine(
    (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    "Slug must contain lowercase letters, numbers, and hyphens only.",
  ),
  subtitle: z.string().trim().max(300),
  excerpt: z.string().trim().max(500),
  content: tiptapDocumentSchema,
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  isReady: z.boolean(),
});

export const blogPostInputSchema = z.object({
  revision: z.number().int().positive(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledAt: z.string().datetime().nullable().or(z.date().nullable()),
  translations: z.object({ FR: translationSchema, EN: translationSchema }),
  categoryIds: z.array(z.number().int().positive()).max(20),
  tagIds: z.array(z.number().int().positive()).max(50),
  mediaIds: z.array(z.number().int().positive()).max(100).refine((items) => new Set(items).size === items.length, "Media must be unique."),
  coverMediaId: z.number().int().positive().nullable(),
}).superRefine((value, context) => {
  if (value.coverMediaId !== null && !value.mediaIds.includes(value.coverMediaId)) {
    context.addIssue({ code: "custom", path: ["coverMediaId"], message: "Cover media must be attached to the post." });
  }
});
