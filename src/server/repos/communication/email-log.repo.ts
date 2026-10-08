import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const emailLogRepository = {
  findById(id: number) {
    return prisma.emailLog.findUnique({
      where: { id },
    });
  },

  findMany(args?: Prisma.EmailLogFindManyArgs) {
    return prisma.emailLog.findMany({
      ...args,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByContactMessageId(contactMessageId: number) {
    return prisma.emailLog.findMany({
      where: {
        contactMessageId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findPending() {
    return prisma.emailLog.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  create(data: Prisma.EmailLogCreateInput) {
    return prisma.emailLog.create({
      data,
    });
  },

  update(id: number, data: Prisma.EmailLogUpdateInput) {
    return prisma.emailLog.update({
      where: { id },
      data,
    });
  },

  markAsSent(id: number, providerMessageId?: string) {
    return prisma.emailLog.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        providerMessageId,
        errorMessage: null,
      },
    });
  },

  markAsFailed(id: number, errorMessage: string) {
    return prisma.emailLog.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage,
      },
    });
  },
};
