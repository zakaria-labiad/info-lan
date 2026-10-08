import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/admin/shared";
import { LegalEditor, SettingsForm } from "@/components/admin/settings";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";
export default async function SettingsPage() { await requireAdminPageUser("ADMIN"); const locale = (await getLocale()) === "en" ? "en" : "fr"; const [settings, documents] = await Promise.all([prisma.siteSettings.findUnique({ where: { id: 1 } }), prisma.legalDocument.findMany({ orderBy: [{ type: "asc" }, { locale: "asc" }] })]); return <><PageHeader title={locale === "fr" ? "Paramètres" : "Settings"} description={locale === "fr" ? "Coordonnées, e-mail, réseaux sociaux et SEO du site." : "Site contact, email, social, and SEO settings."} /><SettingsForm initial={settings} locale={locale} /><LegalEditor documents={documents} locale={locale} /></>; }
