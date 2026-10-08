import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const userRepository = {
  findById(id: number) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  },

  findMany(args?: Prisma.UserFindManyArgs) {
    return prisma.user.findMany({
      ...args,
      where: {
        ...args?.where,
        deletedAt: null,
      },
    });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  softDelete(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  },

  restore(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
    });
  },
};
