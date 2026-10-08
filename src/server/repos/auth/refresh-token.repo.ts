import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const refreshTokenRepository = {
  findByTokenHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  },

  findById(id: number) {
    return prisma.refreshToken.findUnique({
      where: { id },
    });
  },

  findByUserId(userId: number) {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  create(data: Prisma.RefreshTokenCreateInput) {
    return prisma.refreshToken.create({
      data,
    });
  },

  revoke(id: number) {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  revokeAllForUser(userId: number) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  delete(id: number) {
    return prisma.refreshToken.delete({
      where: { id },
    });
  },
};
