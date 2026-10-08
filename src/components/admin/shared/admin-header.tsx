import Link from "next/link";
import { getTranslations } from "next-intl/server";

async function AdminHeader() {
  const t = await getTranslations("admin");

  return (
    <header className="w-full border-b border-border bg-background-soft">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/admin" className="font-heading text-sm font-semibold">
          INFO-L@N {t("overview.title")}
        </Link>
        <Link href="/" className="link text-sm">
          {t("viewSite")}
        </Link>
      </div>
    </header>
  );
}

export { AdminHeader };
