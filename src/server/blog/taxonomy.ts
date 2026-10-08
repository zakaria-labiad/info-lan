import { z } from "zod";

const slug = z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const base = {
  nameFr: z.string().trim().min(1).max(100),
  nameEn: z.string().trim().min(1).max(100),
  slugFr: slug,
  slugEn: slug,
};

export const blogCategoryInputSchema = z.object({
  ...base,
  descriptionFr: z.string().trim().max(500).default(""),
  descriptionEn: z.string().trim().max(500).default(""),
  sortOrder: z.number().int().min(0).max(10_000).default(0),
  isActive: z.boolean().default(true),
});

export const blogTagInputSchema = z.object(base);
