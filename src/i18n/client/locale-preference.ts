import { defaultLocale, locales, type Locale } from "@/i18n/shared/config";

export const INFO_LAN_LOCALE_STORAGE_KEY = "info-lan-locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function resolvePreferredLocale(
  savedLocale: unknown,
  browserLanguage: string | null | undefined,
): Locale {
  if (isLocale(savedLocale)) {
    return savedLocale;
  }

  return browserLanguage?.toLowerCase().startsWith("en") ? "en" : defaultLocale;
}
