import { z } from "zod";

const trimmed = (max: number) => z.string().trim().min(1).max(max);

export const contactInputSchema = z.object({
  name: trimmed(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(40).optional(),
  subject: trimmed(200),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["fr", "en", "FR", "EN"]).transform((value) => value.toUpperCase() as "FR" | "EN"),
  website: z.string().max(0).default(""),
});
