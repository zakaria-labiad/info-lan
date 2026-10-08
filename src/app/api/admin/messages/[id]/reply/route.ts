import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { env } from "@/lib/env";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canSendEmails } from "@/server/auth/permissions";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin } from "@/server/http/api";
import { messageReplySchema } from "@/server/messages/validation";

type RouteContext = { params: Promise<{ id: string }> };

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canSendEmails(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return apiError("INVALID_ID", "The message id is invalid.", 400);
  const parsed = messageReplySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  }

  const message = await prisma.contactMessage.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, email: true, status: true },
  });
  if (!message) return apiError("NOT_FOUND", "Message not found.", 404);

  const existing = await prisma.emailLog.findUnique({
    where: { idempotencyKey: parsed.data.idempotencyKey },
  });
  if (existing && ["SENT", "DELIVERED", "BOUNCED"].includes(existing.status)) {
    return NextResponse.json({ data: existing });
  }
  if (existing && existing.contactMessageId !== id) {
    return apiError("IDEMPOTENCY_CONFLICT", "This request key belongs to another message.", 409);
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const fromAddress = settings?.emailFromAddress ?? env.EMAIL_FROM_ADDRESS;
  const fromName = settings?.emailFromName ?? env.EMAIL_FROM_NAME;
  const html = `<p>${escapeHtml(parsed.data.body).replaceAll("\n", "<br>")}</p>`;
  const log = existing ?? await prisma.emailLog.create({
    data: {
      contactMessageId: id,
      sentById: user.id,
      idempotencyKey: parsed.data.idempotencyKey,
      toEmail: message.email,
      subject: parsed.data.subject,
      bodyHtml: html,
      bodyText: parsed.data.body,
    },
  });

  if (!env.RESEND_API_KEY || !fromAddress) {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: { status: "FAILED", failedAt: new Date(), errorMessage: "Email provider is not configured." },
    });
    return apiError("EMAIL_NOT_CONFIGURED", "Email delivery is not configured.", 503);
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send(
    {
      from: `${fromName} <${fromAddress}>`,
      to: message.email,
      subject: parsed.data.subject,
      text: parsed.data.body,
      html,
      replyTo: fromAddress,
      tags: [{ name: "contact_message_id", value: String(id) }],
    },
    { idempotencyKey: parsed.data.idempotencyKey },
  );

  if (result.error || !result.data) {
    const failure = await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        errorMessage: result.error?.message ?? "Unknown provider error.",
      },
    });
    return NextResponse.json({ error: { code: "EMAIL_SEND_FAILED", message: "The email could not be sent." }, data: failure }, { status: 502 });
  }

  const sentAt = new Date();
  const sent = await prisma.$transaction(async (tx) => {
    const email = await tx.emailLog.update({
      where: { id: log.id },
      data: {
        status: "SENT",
        providerMessageId: result.data.id,
        sentAt,
        failedAt: null,
        errorMessage: null,
      },
    });
    await tx.contactMessage.update({
      where: { id },
      data: message.status === "ARCHIVED"
        ? { repliedAt: sentAt, revision: { increment: 1 } }
        : { status: "REPLIED", repliedAt: sentAt, revision: { increment: 1 } },
    });
    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "REPLY",
        entityType: "ContactMessage",
        entityId: id,
        metadata: { emailLogId: log.id, providerMessageId: result.data.id },
        ipAddress: getClientIp(request),
        userAgent: request.headers.get("user-agent"),
      },
    });
    return email;
  });

  return NextResponse.json({ data: sent });
}
