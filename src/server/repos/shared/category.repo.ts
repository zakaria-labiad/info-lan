import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const blogCategoryRepository = {
  findMany(args?: Prisma.BlogCategoryFindManyArgs) {
    return prisma.blogCategory.findMany({
      ...args,
      where: { ...args?.where, deletedAt: null },
      orderBy: args?.orderBy ?? { sortOrder: "asc" },
    });
  },
  create(data: Prisma.BlogCategoryCreateInput) {
    return prisma.blogCategory.create({ data });
  },
  update(id: number, data: Prisma.BlogCategoryUpdateInput) {
    return prisma.blogCategory.update({ where: { id }, data });
  },
  softDelete(id: number) {
    return prisma.blogCategory.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  },
};

export const productCategoryRepository = {
  findMany(args?: Prisma.ProductCategoryFindManyArgs) {
    return prisma.productCategory.findMany({
      ...args,
      where: { ...args?.where, deletedAt: null },
      orderBy: args?.orderBy ?? { sortOrder: "asc" },
    });
  },
  create(data: Prisma.ProductCategoryCreateInput) {
    return prisma.productCategory.create({ data });
  },
  update(id: number, data: Prisma.ProductCategoryUpdateInput) {
    return prisma.productCategory.update({ where: { id }, data });
  },
  softDelete(id: number) {
    return prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  },
};

export const categoryRepository = {
  blog: blogCategoryRepository,
  product: productCategoryRepository,
};
