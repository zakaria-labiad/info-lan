import { randomUUID } from "node:crypto";

import { prisma } from "@/server/db/prisma";
import {
  generateRefreshToken,
  hashRefreshToken,
  createAccessToken,
} from "@/server/auth/tokens";

const REFRESH_TOKEN_DAYS = 30;

type SessionMetadata = {
  ipAddress?: string;
  userAgent?: string;
};

export async function createSession(
  userId: number,
  role: "ADMIN" | "EMPLOYEE",
  options?: SessionMetadata,
) {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      familyId: randomUUID(),
      expiresAt,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    },
  });

  const accessToken = await createAccessToken({
    userId,
    role,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function rotateSession(refreshToken: string, options?: SessionMetadata) {
  const tokenHash = hashRefreshToken(refreshToken);
  const current = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !current ||
    current.revokedAt ||
    current.expiresAt <= new Date() ||
    !current.user.isActive ||
    current.user.deletedAt
  ) {
    return null;
  }

  const nextRefreshToken = generateRefreshToken();
  const nextTokenHash = hashRefreshToken(nextRefreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: current.id },
      data: { revokedAt: new Date(), replacedByHash: nextTokenHash },
    }),
    prisma.refreshToken.create({
      data: {
        userId: current.userId,
        tokenHash: nextTokenHash,
        familyId: current.familyId,
        expiresAt,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      },
    }),
  ]);

  return {
    accessToken: await createAccessToken({
      userId: current.user.id,
      role: current.user.role,
    }),
    refreshToken: nextRefreshToken,
  };
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllUserSessions(userId: number): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
