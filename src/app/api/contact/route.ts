import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { contactInputSchema } from "@/server/contact/validation";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin, hashPrivateValue } from "@/server/http/api";

const MAX_MESSAGES_PER_HOUR = 5;

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) {
    return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  }

  const parsed = contactInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Please check the submitted fields.",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const ipHash = hashPrivateValue(getClientIp(request));
  const recentCount = await prisma.contactMessage.count({
    where: {
      ipHash,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      deletedAt: null,
    },
  });
  if (recentCount >= MAX_MESSAGES_PER_HOUR) {
    return apiError("RATE_LIMITED", "Too many messages. Please try again later.", 429);
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      body: parsed.data.message,
      locale: parsed.data.locale,
      source: "contact-page",
      ipHash,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ data: message }, { status: 201 });
}
