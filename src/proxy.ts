import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/client/navigation";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|admin|_next|_vercel|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\..*).*)",
  ],
};
