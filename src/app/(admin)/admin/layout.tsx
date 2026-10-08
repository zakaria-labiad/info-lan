import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { SonnerToaster } from "@/components/admin/ui";
import { cn } from "@/lib/admin/utils";
import { adminMessagesByLocale } from "@/i18n/admin/messages";
import { sharedMessagesByLocale } from "@/i18n/shared/messages";

const geist = localFont({
  src: "../../../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-admin-sans",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.overview");
  return {
    title: t("title"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

async function AdminLayout({ children }: { children: ReactNode }) {
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  return (
    <NextIntlClientProvider locale={locale} messages={{ admin: adminMessagesByLocale[locale], ...sharedMessagesByLocale[locale] }}>
      <div className={cn("admin-theme flex min-h-screen flex-1 flex-col", geist.variable)}>
        {children}
        <SonnerToaster />
      </div>
    </NextIntlClientProvider>
  );
}

export default AdminLayout;
