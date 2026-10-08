import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/client/seo";
import {
  AppMotion,
  Footer,
  Header,
} from "@/components/client/shared/layout";
import { locales, type Locale } from "@/i18n/shared/config";
import { getSiteUrl } from "@/lib/shared/site";
import { clientMessagesByLocale } from "@/i18n/client/messages";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ClientLocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;

  setRequestLocale(validLocale);

  const siteUrl = getSiteUrl();
  const organizationId = new URL("/#organization", siteUrl).toString();
  const websiteId = new URL("/#website", siteUrl).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "INFO-L@N",
        telephone: "+212522398484",
        address: {
          "@type": "PostalAddress",
          streetAddress: "20 rue Banafsaj – ex-Violettes, résidence Nouhayla",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
        url: siteUrl.toString(),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "INFO-L@N",
        url: siteUrl.toString(),
        inLanguage: locales,
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <NextIntlClientProvider locale={validLocale} messages={clientMessagesByLocale[validLocale]}>
      <JsonLd data={structuredData} />
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <Header />

        <AppMotion className="mt-20 w-full flex-1">{children}</AppMotion>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
