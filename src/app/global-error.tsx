"use client";

import { useEffect, useSyncExternalStore } from "react";

import { defaultLocale, locales, type Locale } from "@/i18n/shared/config";
import enCommon from "@/messages/en/common.json";
import frCommon from "@/messages/fr/common.json";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useSyncExternalStore(
    () => () => {},
    () => {
      const pathnameLocale = window.location.pathname.split("/").filter(Boolean)[0];

      return locales.includes(pathnameLocale as Locale)
        ? (pathnameLocale as Locale)
        : defaultLocale;
    },
    () => defaultLocale,
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  const messages = locale === "en" ? enCommon : frCommon;

  return (
    <html lang={locale}>
      <body>
        <main
          role="alert"
          style={{
            display: "flex",
            minHeight: "100dvh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{messages.errors.unexpected}</h1>
          <button type="button" onClick={() => reset()}>
            {messages.errors.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
