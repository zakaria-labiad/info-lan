import { BookOpen, CalendarClock, MessageSquare, Package, Send, type LucideIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

type Metric = { label: { fr: string; en: string }; value: number; icon: LucideIcon };

export default async function AdminDashboardPage() {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const now = new Date();
  const [unreadMessages, pendingComments, drafts, scheduledPosts, products, recentActivity] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "NEW", deletedAt: null } }),
    prisma.blogComment.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.blogPost.count({ where: { status: "DRAFT", deletedAt: null } }),
    prisma.blogPost.count({ where: { status: "SCHEDULED", scheduledAt: { gt: now }, deletedAt: null } }),
    prisma.product.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.auditLog.findMany({ include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const formatActivityDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const metrics: Metric[] = [
    { label: { fr: "Messages non lus", en: "Unread messages" }, value: unreadMessages, icon: MessageSquare },
    { label: { fr: "Commentaires à modérer", en: "Pending comments" }, value: pendingComments, icon: Send },
    { label: { fr: "Brouillons", en: "Draft posts" }, value: drafts, icon: BookOpen },
    { label: { fr: "Articles programmés", en: "Scheduled posts" }, value: scheduledPosts, icon: CalendarClock },
    { label: { fr: "Produits publiés", en: "Published products" }, value: products, icon: Package },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {locale === "fr" ? "Tableau de bord" : "Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "fr" ? "Vue d’ensemble de l’activité INFO-L@N." : "Overview of INFO-L@N activity."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label.en}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label[locale]}</CardTitle>
              <metric.icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent><p className="text-3xl font-bold">{metric.value}</p></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>{locale === "fr" ? "Activité récente" : "Recent activity"}</CardTitle></CardHeader>
        <CardContent>
          {recentActivity.length ? <ol className="divide-y">{recentActivity.map((entry) => <li key={entry.id} className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row sm:items-center"><span><strong>{entry.user?.name ?? "System"}</strong> · {entry.action} · {entry.entityType}{entry.entityId ? ` #${entry.entityId}` : ""}</span><time className="text-xs text-muted-foreground" dateTime={entry.createdAt.toISOString()}>{formatActivityDate.format(entry.createdAt)}</time></li>)}</ol> : <p className="text-sm text-muted-foreground">{locale === "fr" ? "Aucune activité enregistrée." : "No activity recorded."}</p>}
        </CardContent>
      </Card>
    </>
  );
}
