import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { getLocale, getTranslations } from "next-intl/server";

import "@/app/globals.css";
import { getSiteUrl } from "@/lib/shared/site";
import { cn } from "@/lib/shared/utils";

const openSans = localFont({
  src: "../../node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2",
  variable: "--font-open-sans",
  weight: "300 800",
  style: "normal",
  display: "swap",
});

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/montserrat/Montserrat-Thin.ttf", weight: "100" },
    { path: "../../public/fonts/montserrat/Montserrat-ExtraLight.ttf", weight: "200" },
    { path: "../../public/fonts/montserrat/Montserrat-Light.ttf", weight: "300" },
    { path: "../../public/fonts/montserrat/Montserrat-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/montserrat/Montserrat-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/montserrat/Montserrat-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/montserrat/Montserrat-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/montserrat/Montserrat-ExtraBold.ttf", weight: "800" },
    { path: "../../public/fonts/montserrat/Montserrat-Black.ttf", weight: "900" },
  ],
  variable: "--font-montserrat-local",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.metadata");

  return {
    metadataBase: getSiteUrl(),
    applicationName: "INFO-L@N",
    title: {
      default: "INFO-L@N",
      template: "%s | INFO-L@N",
    },
    description: t("description"),
    category: "Computer equipment and IT services",
    creator: "INFO-L@N",
    publisher: "INFO-L@N",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        openSans.variable,
        montserrat.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
