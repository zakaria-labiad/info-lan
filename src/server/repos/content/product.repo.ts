import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const productRepository = {
  findById(id: number) {
    return prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  findBySlug(slug: string, locale: "FR" | "EN" = "FR") {
    return prisma.product.findFirst({
      where: {
        deletedAt: null,
        translations: { some: { locale, slug } },
      },
      include: { translations: true },
    });
  },

  findMany(args?: Prisma.ProductFindManyArgs) {
    return prisma.product.findMany({
      ...args,
      where: {
        ...args?.where,
        deletedAt: null,
      },
    });
  },

  findPublished(args?: Prisma.ProductFindManyArgs) {
    return prisma.product.findMany({
      ...args,
      where: {
        ...args?.where,
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: { translations: true, ...args?.include },
    });
  },

  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  },

  update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  softDelete(id: number) {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  restore(id: number) {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  },
};
