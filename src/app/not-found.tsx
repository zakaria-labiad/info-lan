import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common.errors");
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t("notFound")}</h1>
      <p className="text-sm text-foreground/70">{t("notFoundDescription")}</p>
    </main>
  );
}
