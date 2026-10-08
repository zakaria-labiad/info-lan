import "server-only";

import pino from "pino";

import { env } from "@/lib/env";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
    level: env.LOG_LEVEL ?? "info",

    base: {
        service: env.APP_NAME ?? "next-app",
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
        paths: [
            "password",
            "passcode",
            "passcodeHash",
            "token",
            "accessToken",
            "refreshToken",
            "authorization",
            "cookie",
        ],
        censor: "[REDACTED]",
    },

    ...(isDevelopment && {
        transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            singleLine: false,
        },
        },
    }),
});
