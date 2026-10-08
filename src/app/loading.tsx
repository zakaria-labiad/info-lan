import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("common");
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <p className="text-sm text-foreground/70">{t("loading")}</p>
    </main>
  );
}
