import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const blogPostRepository = {
  findById(id: number) {
    return prisma.blogPost.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  findBySlug(slug: string, locale: "FR" | "EN" = "FR") {
    return prisma.blogPost.findFirst({
      where: {
        deletedAt: null,
        translations: { some: { locale, slug } },
      },
      include: { translations: true },
    });
  },

  findMany(args?: Prisma.BlogPostFindManyArgs) {
    return prisma.blogPost.findMany({
      ...args,
      where: {
        ...args?.where,
        deletedAt: null,
      },
    });
  },

  findPublished(args?: Prisma.BlogPostFindManyArgs) {
    return prisma.blogPost.findMany({
      ...args,
      where: {
        ...args?.where,
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
        deletedAt: null,
      },
      include: { translations: true, ...args?.include },
      orderBy: {
        publishedAt: "desc",
      },
    });
  },

  create(data: Prisma.BlogPostCreateInput) {
    return prisma.blogPost.create({
      data,
    });
  },

  update(id: number, data: Prisma.BlogPostUpdateInput) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  },

  softDelete(id: number) {
    return prisma.blogPost.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  restore(id: number) {
    return prisma.blogPost.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  },
};
