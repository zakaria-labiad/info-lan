import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";

export const mediaRepository = {
  findById(id: number) {
    return prisma.media.findFirst({ where: { id, deletedAt: null } });
  },
  findMany(args?: Prisma.MediaFindManyArgs) {
    return prisma.media.findMany({
      ...args,
      where: { ...args?.where, deletedAt: null },
      orderBy: args?.orderBy ?? { createdAt: "desc" },
    });
  },
  findForBlogPost(postId: number) {
    return prisma.blogPostMedia.findMany({
      where: { postId, media: { deletedAt: null } },
      include: { media: true },
      orderBy: { sortOrder: "asc" },
    });
  },
  findForProduct(productId: number) {
    return prisma.productMedia.findMany({
      where: { productId, media: { deletedAt: null } },
      include: { media: true },
      orderBy: { sortOrder: "asc" },
    });
  },
  create(data: Prisma.MediaCreateInput) {
    return prisma.media.create({ data });
  },
  update(id: number, data: Prisma.MediaUpdateInput) {
    return prisma.media.update({ where: { id }, data });
  },
  softDelete(id: number) {
    return prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
  },
  restore(id: number) {
    return prisma.media.update({ where: { id }, data: { deletedAt: null } });
  },
  async deletePermanent(id: number) {
    const references = await prisma.media.findUnique({
      where: { id },
      select: { _count: { select: { blogPosts: true, products: true } } },
    });

    if (!references) return null;
    if (references._count.blogPosts > 0 || references._count.products > 0) {
      throw new Error("Referenced media must be detached before deletion");
    }

    return prisma.media.delete({ where: { id } });
  },
};
