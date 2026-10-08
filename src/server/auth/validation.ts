import { z } from "zod";

const normalizedEmail = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

export const loginInputSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1).max(1024),
  rememberMe: z.boolean().default(false),
});

export const forgotPasswordInputSchema = z.object({
  email: normalizedEmail,
});

export const resetPasswordInputSchema = z.object({
  token: z.string().trim().min(1).max(512),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const userInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: normalizedEmail,
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  preferredLocale: z.enum(["FR", "EN"]),
});

export const accountPasswordSchema = z.object({
  currentPassword: z.string().min(1).max(1024),
  newPassword: resetPasswordInputSchema.shape.password,
});

export function isTrustedMutationOrigin(
  origin: string | null,
  expectedHost: string | null,
): boolean {
  if (!origin || !expectedHost) return false;

  try {
    const originHost = new URL(origin).host.toLowerCase();
    const requestHost = expectedHost.split(",", 1)[0]!.trim().toLowerCase();
    return originHost === requestHost;
  } catch {
    return false;
  }
}
