import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageMessages } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError } from "@/server/http/api";
import { messageListQuerySchema } from "@/server/messages/validation";

export async function GET(request: NextRequest) {
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageMessages(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);

  const parsed = messageListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid query parameters.", 400, parsed.error.flatten().fieldErrors);
  }

  const { page, perPage, status, search, assignedTo } = parsed.data;
  const where: Prisma.ContactMessageWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(assignedTo ? { assignedToId: assignedTo } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { subject: { contains: search } },
            { body: { contains: search } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { assignee: { select: { id: true, name: true } } },
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return NextResponse.json({
    data,
    meta: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) },
  });
}
