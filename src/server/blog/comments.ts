import { z } from "zod";

export const publicCommentInputSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5_000),
  locale: z.enum(["FR", "EN"]),
  website: z.string().max(0).optional().default(""),
});

export const commentModerationSchema = z.object({
  status: z.enum(["APPROVED", "HIDDEN", "SPAM", "DELETED"]),
});
