import enCommon from "@/messages/en/common.json";
import frCommon from "@/messages/fr/common.json";
import type { Locale } from "@/i18n/shared/config";

const sharedMessagesByLocale = {
  en: { common: enCommon },
  fr: { common: frCommon },
} satisfies Record<Locale, Record<string, unknown>>;

export { sharedMessagesByLocale };
