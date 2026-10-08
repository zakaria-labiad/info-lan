import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/admin/auth";
import { getCurrentAdminUser } from "@/server/auth/guard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.login");
  return { title: t("title"), description: t("metadataDescription") };
}

export default async function AdminLoginPage() {
  if (await getCurrentAdminUser()) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
