import { getLocale } from "next-intl/server";
import { AccountSecurity } from "@/components/admin/account";
import { PageHeader } from "@/components/admin/shared";
import { getCurrentAdminUser } from "@/server/auth/guard";
export default async function AccountPage() { const locale = (await getLocale()) === "en" ? "en" : "fr"; const user = await getCurrentAdminUser(); return <><PageHeader title={locale === "fr" ? "Mon compte" : "My account"} description={user ? `${user.name} · ${user.email}` : undefined} /><AccountSecurity locale={locale} /></>; }
