import { ArrowLeft, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { MessageActions, MessageStatusBadge } from "@/components/admin/messages";
import { PageHeader } from "@/components/admin/shared";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import { requireAdminPageUser } from "@/server/auth/guard";
import { prisma } from "@/server/db/prisma";

export default async function AdminMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageUser();
  const locale = (await getLocale()) === "en" ? "en" : "fr";
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();

  const [message, assignees] = await Promise.all([
    prisma.contactMessage.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignee: { select: { id: true, name: true } },
        notes: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
        assignmentHistory: {
          include: {
            assignedBy: { select: { name: true } },
            assignedTo: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        emails: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.user.findMany({
      where: { isActive: true, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!message) notFound();
  const formatDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <PageHeader
        title={message.subject || (locale === "fr" ? "Message sans objet" : "Message without subject")}
        description={`${locale === "fr" ? "Reçu" : "Received"} ${formatDate.format(message.createdAt)}`}
        action={<MessageStatusBadge status={message.status} locale={locale} />}
      />

      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/admin/messages"><ArrowLeft aria-hidden="true" />{locale === "fr" ? "Retour aux messages" : "Back to messages"}</Link>
      </Button>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>{locale === "fr" ? "Message du client" : "Client message"}</CardTitle></CardHeader>
            <CardContent className="space-y-5 p-2">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex gap-2"><UserRound className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" /><span>{message.name}</span></div>
                <a className="flex gap-2 hover:underline" href={`mailto:${message.email}`}><Mail className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />{message.email}</a>
                {message.phone ? <a className="flex gap-2 hover:underline" href={`tel:${message.phone}`}><Phone className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />{message.phone}</a> : null}
                <div className="flex gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4" aria-hidden="true" /><span>{message.locale} · {message.source}</span></div>
              </div>
              <Separator />
              <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{locale === "fr" ? "Historique" : "Timeline"}</CardTitle></CardHeader>
            <CardContent className="space-y-4 p-2">
              {message.notes.map((note) => (
                <div key={`note-${note.id}`} className="rounded-md border p-3">
                  <div className="mb-1 flex justify-between gap-3 text-xs text-muted-foreground">
                    <strong className="text-foreground">{note.author.name}</strong>
                    <time>{formatDate.format(note.createdAt)}</time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{note.body}</p>
                </div>
              ))}
              {message.assignmentHistory.map((assignment) => (
                <div key={`assignment-${assignment.id}`} className="flex justify-between gap-3 border-b pb-3 text-sm">
                  <span>{assignment.assignedBy.name} → {assignment.assignedTo?.name ?? (locale === "fr" ? "Non affecté" : "Unassigned")}</span>
                  <time className="text-xs text-muted-foreground">{formatDate.format(assignment.createdAt)}</time>
                </div>
              ))}
              {message.emails.map((email) => (
                <div key={`email-${email.id}`} className="flex justify-between gap-3 border-b pb-3 text-sm">
                  <span>{locale === "fr" ? "E-mail" : "Email"}: {email.subject} ({email.status})</span>
                  <time className="text-xs text-muted-foreground">{formatDate.format(email.createdAt)}</time>
                </div>
              ))}
              {!message.notes.length && !message.assignmentHistory.length && !message.emails.length ? (
                <p className="text-sm text-muted-foreground">{locale === "fr" ? "Aucune activité pour le moment." : "No activity yet."}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>{locale === "fr" ? "Actions" : "Actions"}</CardTitle></CardHeader>
          <CardContent className="p-2">
            <MessageActions
              id={message.id}
              revision={message.revision}
              status={message.status}
              assignedToId={message.assignedToId}
              assignees={assignees}
              locale={locale}
              initialSubject={`Re: ${message.subject || (locale === "fr" ? "Votre message" : "Your message")}`}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
