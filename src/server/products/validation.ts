import { z } from "zod";

export { isAllowedMediaUpload } from "@/lib/admin/media";

const slug = z.string().trim().max(140).refine((value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
const translation = z.object({
  title: z.string().trim().max(200),
  slug,
  shortDescription: z.string().trim().max(500),
  description: z.string().trim().max(20_000),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  isReady: z.boolean(),
});

export const productInputSchema = z.object({
  revision: z.number().int().positive(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  family: z.string().trim().max(100),
  availability: z.string().trim().max(100),
  isBestSeller: z.boolean(),
  sortOrder: z.number().int().min(0).max(100_000),
  specifications: z.array(z.object({ name: z.string().trim().min(1).max(100), value: z.string().trim().min(1).max(500) })).max(100),
  options: z.array(z.string().trim().min(1).max(200)).max(100),
  translations: z.object({ FR: translation, EN: translation }),
  categoryIds: z.array(z.number().int().positive()).max(30),
  relatedProductIds: z.array(z.number().int().positive()).max(30),
  mediaIds: z.array(z.number().int().positive()).max(50),
});

export function canDeleteMedia(references: { blogPosts: number; products: number }) {
  return references.blogPosts === 0 && references.products === 0;
}

export const mediaRegistrationSchema = z.object({
  publicId: z.string().trim().min(1).max(500).startsWith("chelbab/"),
  altTextFr: z.string().trim().max(300).default(""),
  altTextEn: z.string().trim().max(300).default(""),
});
