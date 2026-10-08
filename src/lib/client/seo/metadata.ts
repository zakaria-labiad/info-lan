import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { locales, type Locale, type LocalePageProps } from "@/i18n/shared/config";
import { getSiteUrl } from "@/lib/shared/site";

const DEFAULT_SOCIAL_IMAGE = "/images/home/info-lan-hero.webp";

type PageMetadataInput = {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  image?: string;
  index?: boolean;
};

type TranslatedPageMetadataInput = Pick<
  PageMetadataInput,
  "locale" | "pathname" | "image" | "index"
> & {
  namespace: string;
  titleKey?: string;
  descriptionKey?: string;
};

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "";

  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export function getLocalizedPath(locale: Locale, pathname: string) {
  return `/${locale}${normalizePathname(pathname)}`;
}

export function getLocalizedUrl(locale: Locale, pathname: string) {
  return new URL(getLocalizedPath(locale, pathname), getSiteUrl()).toString();
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  index = true,
}: PageMetadataInput): Metadata {
  const canonical = getLocalizedUrl(locale, pathname);
  const images = [new URL(image, getSiteUrl()).toString()];
  const allowIndexing = index && process.env.VERCEL_ENV !== "preview";
  const languages = Object.fromEntries(
    locales.map((alternateLocale) => [
      alternateLocale,
      getLocalizedUrl(alternateLocale, pathname),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "INFO-L@N",
      title,
      description,
      url: canonical,
      locale: locale === "fr" ? "fr_MA" : "en_US",
      alternateLocale: [locale === "fr" ? "en_US" : "fr_MA"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export async function buildTranslatedPageMetadata({
  locale,
  namespace,
  pathname,
  image,
  index,
  titleKey = "title",
  descriptionKey = "description",
}: TranslatedPageMetadataInput) {
  const t = await getTranslations({ locale, namespace });

  return buildPageMetadata({
    locale,
    pathname,
    title: t(titleKey),
    description: t(descriptionKey),
    image,
    index,
  });
}

export function createTranslatedMetadata(
  input: Omit<TranslatedPageMetadataInput, "locale">,
) {
  return async function generateMetadata({ params }: LocalePageProps) {
    const { locale } = await params;

    return buildTranslatedPageMetadata({ ...input, locale });
  };
}
