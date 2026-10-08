import { getTranslations } from "next-intl/server";

export default async function ClientLoading() {
  const t = await getTranslations("common");
  return (
    <div className="flex min-h-64 items-center justify-center p-6">
      <p className="text-sm text-foreground/70">{t("loading")}</p>
    </div>
  );
}
