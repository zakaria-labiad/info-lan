import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { defaultLocale, locales, type Locale } from "@/i18n/shared/config";
import { apiError, hasTrustedOrigin } from "@/server/http/api";

export async function GET() {
  const cookieLocale = (await cookies()).get("locale")?.value;
  const locale: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : defaultLocale;

  return NextResponse.json(
    { locale },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return apiError("INVALID_ORIGIN", "Request origin is not allowed.", 403);
  const body = await request.json().catch(() => null);

  const locale = body?.locale as Locale;

  if (!locales.includes(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("locale", locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
