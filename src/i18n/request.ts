import { getRequestConfig } from "next-intl/server";

import { adminMessagesByLocale } from "@/i18n/admin/messages";
import { clientMessagesByLocale } from "@/i18n/client/messages";
import { defaultLocale, locales, type Locale } from "@/i18n/shared/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale: Locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;

  return {
    locale,
    messages: {
      ...clientMessagesByLocale[locale],
      admin: adminMessagesByLocale[locale],
    },
  };
});
