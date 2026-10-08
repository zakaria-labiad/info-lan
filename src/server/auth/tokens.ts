import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const JWT_SECRET = env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createAccessToken(payload: {
  userId: number;
  role: "ADMIN" | "EMPLOYEE";
}): Promise<string> {
  return new SignJWT({
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.userId))
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<{
  userId: number;
  role: "ADMIN" | "EMPLOYEE";
}> {
  const { payload } = await jwtVerify(token, secret);

  if (!payload.sub) {
    throw new Error("Invalid access token");
  }

  if (payload.role !== "ADMIN" && payload.role !== "EMPLOYEE") {
    throw new Error("Invalid user role");
  }

  return {
    userId: Number(payload.sub),
    role: payload.role,
  };
}
