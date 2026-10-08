import { createHash } from "node:crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { isTrustedMutationOrigin } from "@/server/auth/validation";

export function apiError(
  code: string,
  message: string,
  status: number,
  fieldErrors?: Record<string, string[]>,
) {
  return NextResponse.json(
    { error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } },
    { status },
  );
}

export function hasTrustedOrigin(request: NextRequest) {
  return isTrustedMutationOrigin(
    request.headers.get("origin"),
    request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  );
}

export function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ?? "unknown";
}

export function hashPrivateValue(value: string) {
  return createHash("sha256").update(`${env.JWT_SECRET}:${value}`).digest("hex");
}
