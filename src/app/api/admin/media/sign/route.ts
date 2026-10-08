import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getCurrentAdminUser } from "@/server/auth/guard";
import { canManageContent } from "@/server/auth/permissions";
import { apiError, hasTrustedOrigin } from "@/server/http/api";
import { getCloudinary } from "@/server/media/cloudinary";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const user = await getCurrentAdminUser();
  if (!user) return apiError("UNAUTHENTICATED", "Authentication is required.", 401);
  if (!canManageContent(user.role)) return apiError("FORBIDDEN", "Permission denied.", 403);
  const client = getCloudinary();
  if (!client || !env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_CLOUD_NAME) return apiError("MEDIA_NOT_CONFIGURED", "Media uploads are not configured.", 503);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder: "chelbab", allowed_formats: "jpg,jpeg,png,webp,avif", transformation: "c_limit,w_2400,h_2400,q_auto:good,f_auto" };
  const signature = client.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET);
  return NextResponse.json({ data: { ...params, signature, apiKey: env.CLOUDINARY_API_KEY, cloudName: env.CLOUDINARY_CLOUD_NAME } });
}
