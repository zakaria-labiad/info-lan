import enAdmin from "@/messages/en/admin/navigation.json";
import frAdmin from "@/messages/fr/admin/navigation.json";

import type { Locale } from "@/i18n/shared/config";

const adminMessagesByLocale = {
  en: enAdmin,
  fr: frAdmin,
} satisfies Record<Locale, unknown>;

export { adminMessagesByLocale };
