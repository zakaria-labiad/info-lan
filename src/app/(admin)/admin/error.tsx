"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  const t = useTranslations("common.errors");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold">{t("unexpected")}</h2>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border px-4 py-2 text-sm font-medium"
      >
        {t("retry")}
      </button>
    </div>
  );
}
