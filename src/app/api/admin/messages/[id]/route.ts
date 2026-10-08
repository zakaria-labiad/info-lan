import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { canManageMessages, canSendEmails } from "@/server/auth/permissions";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { messageMutationSchema } from "@/server/messages/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }

  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageMessages(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return apiError("INVALID_ID", "The message id is invalid.", 400);
  }

  const parsed = messageMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Please check the submitted fields.",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const message = await prisma.contactMessage.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, status: true, revision: true },
  });
  if (!message) return apiError("NOT_FOUND", "Message not found.", 404);

  const auditContext = {
    userId: user.id,
    entityType: "ContactMessage",
    entityId: id,
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent"),
  };

  const mutation = parsed.data;

  if (mutation.action === "note") {
    const noteBody = mutation.body;
    const note = await prisma.$transaction(async (tx) => {
      const created = await tx.contactMessageNote.create({
        data: { contactMessageId: id, authorId: user.id, body: noteBody },
        include: { author: { select: { id: true, name: true } } },
      });
      await tx.auditLog.create({
        data: { ...auditContext, action: "UPDATE", metadata: { operation: "note" } },
      });
      return created;
    });
    return NextResponse.json({ data: note });
  }

  if (message.revision !== mutation.revision) {
    return apiError("REVISION_CONFLICT", "This message changed. Refresh and try again.", 409);
  }

  if (mutation.action === "assign") {
    const { assignedToId, revision } = mutation;
    if (assignedToId !== null) {
      const assignee = await prisma.user.findFirst({
        where: { id: assignedToId, isActive: true, deletedAt: null },
        select: { id: true },
      });
      if (!assignee) return apiError("INVALID_ASSIGNEE", "Assignee not found.", 400);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.contactMessage.updateMany({
        where: { id, revision, deletedAt: null },
        data: { assignedToId, revision: { increment: 1 } },
      });
      if (result.count !== 1) return null;
      await tx.contactMessageAssignment.create({
        data: {
          contactMessageId: id,
          assignedById: user.id,
          assignedToId,
        },
      });
      await tx.auditLog.create({
        data: {
          ...auditContext,
          action: "ASSIGN",
          metadata: { assignedToId },
        },
      });
      return tx.contactMessage.findUnique({ where: { id } });
    });
    if (!updated) return apiError("REVISION_CONFLICT", "This message changed. Refresh and try again.", 409);
    return NextResponse.json({ data: updated });
  }

  if (mutation.action === "mark-read") {
    if (message.status !== "NEW") {
      return NextResponse.json({ data: message });
    }
    const updated = await prisma.contactMessage.updateMany({
      where: { id, revision: mutation.revision, status: "NEW", deletedAt: null },
      data: { status: "READ", readAt: new Date(), revision: { increment: 1 } },
    });
    if (updated.count !== 1) {
      return apiError("REVISION_CONFLICT", "This message changed. Refresh and try again.", 409);
    }
    return NextResponse.json({ data: { id, status: "READ", revision: mutation.revision + 1 } });
  }

  if (!canSendEmails(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  if (message.status === "ARCHIVED") {
    return NextResponse.json({ data: message });
  }
  const archived = await prisma.$transaction(async (tx) => {
    const result = await tx.contactMessage.updateMany({
      where: { id, revision: mutation.revision, deletedAt: null },
      data: { status: "ARCHIVED", revision: { increment: 1 } },
    });
    if (result.count !== 1) return null;
    await tx.auditLog.create({
      data: { ...auditContext, action: "ARCHIVE", metadata: { previousStatus: message.status } },
    });
    return tx.contactMessage.findUnique({ where: { id } });
  });
  if (!archived) return apiError("REVISION_CONFLICT", "This message changed. Refresh and try again.", 409);
  return NextResponse.json({ data: archived });
}
