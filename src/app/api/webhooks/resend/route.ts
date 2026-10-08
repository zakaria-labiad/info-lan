import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { env } from "@/lib/env";
import { reduceEmailStatus } from "@/server/email/status";
import { prisma } from "@/server/db/prisma";
import { apiError } from "@/server/http/api";

export async function POST(request: NextRequest) {
  if (!env.RESEND_WEBHOOK_SECRET) {
    return apiError("WEBHOOK_NOT_CONFIGURED", "Webhook verification is not configured.", 503);
  }

  const payload = await request.text();
  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signature = request.headers.get("webhook-signature");
  if (!id || !timestamp || !signature) {
    return apiError("INVALID_SIGNATURE", "Webhook signature is missing.", 400);
  }

  let event;
  try {
    event = new Resend().webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    });
  } catch {
    return apiError("INVALID_SIGNATURE", "Webhook signature is invalid.", 400);
  }

  if (!event.type.startsWith("email.")) {
    return NextResponse.json({ data: { accepted: true } });
  }
  const emailId = "email_id" in event.data ? event.data.email_id : null;
  if (!emailId) return NextResponse.json({ data: { accepted: true } });
  const log = await prisma.emailLog.findUnique({ where: { providerMessageId: emailId } });
  if (!log) return NextResponse.json({ data: { accepted: true } });

  const nextStatus = reduceEmailStatus(log.status, event.type);
  const occurredAt = new Date(event.created_at);
  const reason = "reason" in event.data && typeof event.data.reason === "string" ? event.data.reason : null;
  await prisma.emailLog.update({
    where: { id: log.id },
    data: {
      status: nextStatus,
      ...(nextStatus === "DELIVERED" ? { deliveredAt: occurredAt } : {}),
      ...(["FAILED", "BOUNCED"].includes(nextStatus) ? { failedAt: occurredAt, errorMessage: reason } : {}),
    },
  });

  return NextResponse.json({ data: { accepted: true } });
}
