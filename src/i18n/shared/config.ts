export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export type LocaleRouteParams = {
  locale: Locale;
};

export type LocalePageProps = {
  params: Promise<LocaleRouteParams>;
};

export const defaultLocale: Locale = "fr";
