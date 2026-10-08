import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const auditLogRepository = {
  findById(id: number) {
    return prisma.auditLog.findUnique({
      where: { id },
    });
  },

  findMany(args?: Prisma.AuditLogFindManyArgs) {
    return prisma.auditLog.findMany({
      ...args,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByUserId(userId: number) {
    return prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByEntity(entityType: string, entityId: number) {
    return prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  create(data: Prisma.AuditLogCreateInput) {
    return prisma.auditLog.create({
      data,
    });
  },
};
