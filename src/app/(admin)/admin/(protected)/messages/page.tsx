import { Inbox, Search } from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";

import type { Prisma } from "@/generated/prisma/client";
import { MessageBulkTable } from "@/components/admin/messages";
import { PageHeader } from "@/components/admin/shared";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Input } from "@/components/admin/ui/input";
import { prisma } from "@/server/db/prisma";
import { requireAdminPageUser } from "@/server/auth/guard";
import { messageListQuerySchema } from "@/server/messages/validation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function hrefFor(page: number, values: { status?: string; search?: string }) {
  const params = new URLSearchParams({ page: String(page) });
  if (values.status) params.set("status", values.status);
  if (values.search) params.set("search", values.search);
  return `/admin/messages?${params.toString()}`;
}

export default async function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const raw = await searchParams;
  const parsed = messageListQuerySchema.safeParse({
    page: Array.isArray(raw.page) ? raw.page[0] : raw.page,
    perPage: 20,
    status: Array.isArray(raw.status) ? raw.status[0] : raw.status,
    search: Array.isArray(raw.search) ? raw.search[0] : raw.search,
  });
  const query = parsed.success ? parsed.data : messageListQuerySchema.parse({});
  const where: Prisma.ContactMessageWhereInput = {
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { email: { contains: query.search } },
            { subject: { contains: query.search } },
            { body: { contains: query.search } },
          ],
        }
      : {}),
  };
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      include: { assignee: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
    }),
    prisma.contactMessage.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / query.perPage));

  return (
    <>
      <PageHeader
        title={locale === "fr" ? "Messages" : "Messages"}
        description={locale === "fr" ? "Gérez les demandes envoyées depuis le site." : "Manage requests submitted from the website."}
      />

      <Card>
        <CardContent className="space-y-4 p-2">
          <form className="flex flex-col gap-2 sm:flex-row" action="/admin/messages">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                name="search"
                defaultValue={query.search}
                className="pl-9"
                placeholder={locale === "fr" ? "Rechercher par nom, e-mail ou contenu" : "Search name, email, or content"}
                aria-label={locale === "fr" ? "Rechercher les messages" : "Search messages"}
              />
            </div>
            <select
              name="status"
              defaultValue={query.status ?? ""}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs"
              aria-label={locale === "fr" ? "Filtrer par statut" : "Filter by status"}
            >
              <option value="">{locale === "fr" ? "Tous les statuts" : "All statuses"}</option>
              <option value="NEW">{locale === "fr" ? "Nouveaux" : "New"}</option>
              <option value="READ">{locale === "fr" ? "Lus" : "Read"}</option>
              <option value="REPLIED">{locale === "fr" ? "Répondus" : "Replied"}</option>
              <option value="ARCHIVED">{locale === "fr" ? "Archivés" : "Archived"}</option>
            </select>
            <Button type="submit">{locale === "fr" ? "Filtrer" : "Filter"}</Button>
          </form>

          {messages.length ? (
            <MessageBulkTable messages={messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }))} locale={locale} />
          ) : (
            <EmptyState
              icon={<Inbox className="size-full" aria-hidden="true" />}
              title={locale === "fr" ? "Aucun message" : "No messages"}
              description={locale === "fr" ? "Aucun résultat ne correspond à vos filtres." : "No results match your filters."}
            />
          )}

          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              {locale === "fr" ? `${total} message${total === 1 ? "" : "s"}` : `${total} message${total === 1 ? "" : "s"}`}
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" disabled={query.page <= 1}>
                <Link aria-disabled={query.page <= 1} tabIndex={query.page <= 1 ? -1 : undefined} href={hrefFor(Math.max(1, query.page - 1), query)}>
                  {locale === "fr" ? "Précédent" : "Previous"}
                </Link>
              </Button>
              <span className="self-center text-muted-foreground">{query.page} / {totalPages}</span>
              <Button asChild variant="outline" size="sm" disabled={query.page >= totalPages}>
                <Link aria-disabled={query.page >= totalPages} tabIndex={query.page >= totalPages ? -1 : undefined} href={hrefFor(Math.min(totalPages, query.page + 1), query)}>
                  {locale === "fr" ? "Suivant" : "Next"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
