"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("common.errors");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t("unexpected")}</h1>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border px-4 py-2 text-sm font-medium"
      >
        {t("retry")}
      </button>
    </main>
  );
}
