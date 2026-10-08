import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const contactMessageRepository = {
  findById(id: number) {
    return prisma.contactMessage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  findMany(args?: Prisma.ContactMessageFindManyArgs) {
    return prisma.contactMessage.findMany({
      ...args,
      where: {
        ...args?.where,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByEmail(email: string) {
    return prisma.contactMessage.findMany({
      where: {
        email,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({
      data,
    });
  },

  update(id: number, data: Prisma.ContactMessageUpdateInput) {
    return prisma.contactMessage.update({
      where: { id },
      data,
    });
  },

  markAsRead(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });
  },

  markAsReplied(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        status: "REPLIED",
        repliedAt: new Date(),
      },
    });
  },

  softDelete(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  restore(id: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  },
};
