import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { publicCommentInputSchema } from "@/server/blog/comments";
import { prisma } from "@/server/db/prisma";
import { apiError, getClientIp, hasTrustedOrigin, hashPrivateValue } from "@/server/http/api";

const MAX_COMMENTS_PER_HOUR = 5;

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const parsed = publicCommentInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("VALIDATION_ERROR", "Please check the submitted fields.", 400, parsed.error.flatten().fieldErrors);
  const { slug } = await params;
  const now = new Date();
  const translation = await prisma.blogPostTranslation.findFirst({
    where: {
      slug,
      locale: parsed.data.locale,
      isReady: true,
      post: {
        deletedAt: null,
        OR: [
          { status: "PUBLISHED", publishedAt: { lte: now } },
          { status: "SCHEDULED", scheduledAt: { lte: now } },
        ],
      },
    },
    select: { postId: true },
  });
  if (!translation) return apiError("NOT_FOUND", "Post not found.", 404);

  const ipHash = hashPrivateValue(getClientIp(request));
  const recentCount = await prisma.blogComment.count({
    where: { ipHash, createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1_000) }, deletedAt: null },
  });
  if (recentCount >= MAX_COMMENTS_PER_HOUR) return apiError("RATE_LIMITED", "Too many comments. Please try again later.", 429);

  const comment = await prisma.blogComment.create({
    data: {
      postId: translation.postId,
      locale: parsed.data.locale,
      authorName: parsed.data.fullName,
      authorEmail: parsed.data.email,
      subject: parsed.data.subject,
      body: parsed.data.message,
      ipHash,
    },
    select: { id: true, createdAt: true, status: true },
  });
  return NextResponse.json({ data: comment }, { status: 201 });
}
