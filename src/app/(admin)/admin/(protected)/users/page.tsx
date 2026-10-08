import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/admin/shared";
import { UserManager } from "@/components/admin/users";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";
export default async function UsersPage() { const current = await requireAdminPageUser("ADMIN"); const locale = (await getLocale()) === "en" ? "en" : "fr"; const users = await prisma.user.findMany({ where: { deletedAt: null }, select: { id: true, name: true, email: true, role: true, preferredLocale: true, isActive: true, mustResetPassword: true, lastLoginAt: true }, orderBy: { createdAt: "desc" } }); return <><PageHeader title={locale === "fr" ? "Utilisateurs" : "Users"} description={locale === "fr" ? "Invitez des administrateurs et employés et contrôlez leurs accès." : "Invite administrators and employees and control their access."} /><UserManager users={users} currentUserId={current.id} locale={locale} /></>; }
