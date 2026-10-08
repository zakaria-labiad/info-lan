import "server-only";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    // DATABASE
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // JWT
    JWT_SECRET: z
        .string()
        .min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_ACCESS_TOKEN_EXPIRES_IN: z
        .string()
        .default("15m"),
    JWT_REFRESH_TOKEN_EXPIRES_IN: z
        .string()
        .default("30d"),
    
    // LOGS
    LOG_LEVEL: z
        .enum(["trace", "debug", "info", "warn", "error", "fatal"])
        .default("info"),
    APP_NAME: z
        .string()
        .default("next-app"),

    // EMAIL
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
    EMAIL_FROM_NAME: z.string().min(1).default("INFO-L@N"),
    EMAIL_FROM_ADDRESS: z.string().email().optional(),

    // MEDIA
    CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
    CLOUDINARY_API_KEY: z.string().min(1).optional(),
    CLOUDINARY_API_SECRET: z.string().min(1).optional(),

    PUBLIC_SITE_URL: z.string().url().optional(),
    BOOTSTRAP_ADMIN_NAME: z.string().min(1).optional(),
    BOOTSTRAP_ADMIN_EMAIL: z.string().email().optional(),
    BOOTSTRAP_ADMIN_PASSWORD: z.string().min(12).optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "❌ Invalid environment variables:",
        parsedEnv.error.flatten().fieldErrors,
    );

    throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
