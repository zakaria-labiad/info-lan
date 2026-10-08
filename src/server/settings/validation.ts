import { z } from "zod";
const optionalText = (max: number) => z.string().trim().max(max);
const optionalUrl = z.string().trim().refine((value) => !value || /^https:\/\//i.test(value), "Use an HTTPS URL.");
const optionalEmail = z.string().trim().refine((value) => !value || z.string().email().safeParse(value).success, "Use a valid email.");
export const siteSettingsInputSchema = z.object({
  companyName: z.string().trim().min(1).max(150), contactEmail: optionalEmail, contactPhone: optionalText(80), addressFr: optionalText(500), addressEn: optionalText(500), publicSiteUrl: optionalUrl, emailFromName: optionalText(150), emailFromAddress: optionalEmail, facebookUrl: optionalUrl, instagramUrl: optionalUrl, linkedinUrl: optionalUrl, youtubeUrl: optionalUrl, seoTitleFr: optionalText(70), seoTitleEn: optionalText(70), seoDescriptionFr: optionalText(170), seoDescriptionEn: optionalText(170), mapLatitude: z.number().min(-90).max(90).nullable(), mapLongitude: z.number().min(-180).max(180).nullable(),
});

export const legalDocumentInputSchema = z.object({
  type: z.enum(["PRIVACY", "TERMS"]),
  locale: z.enum(["FR", "EN"]),
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body: z.string().trim().min(1).max(100_000),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
