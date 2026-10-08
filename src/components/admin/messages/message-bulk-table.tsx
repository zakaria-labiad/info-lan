"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MessageStatusBadge } from "@/components/admin/messages/status-badge";
import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";

type MessageRow = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  revision: number;
  createdAt: string;
  assignee: { name: string } | null;
};

export function MessageBulkTable({ messages, locale }: { messages: MessageRow[]; locale: "fr" | "en" }) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const selectedRows = useMemo(() => messages.filter((message) => selected.includes(message.id)), [messages, selected]);
  const formatDate = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }), [locale]);
  const allSelected = messages.length > 0 && selected.length === messages.length;

  async function mutate(action: "mark-read" | "archive") {
    const eligible = selectedRows.filter((message) => action === "mark-read" ? message.status === "NEW" : message.status !== "ARCHIVED");
    if (!eligible.length) return;
    setBusy(true);
    try {
      const responses = await Promise.all(eligible.map((message) => fetch(`/api/admin/messages/${message.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, revision: message.revision }) })));
      const failed = responses.find((response) => !response.ok);
      if (failed) {
        const result = await failed.json();
        throw new Error(result.error?.message ?? "Request failed");
      }
      setSelected([]);
      toast.success(locale === "fr" ? `${eligible.length} message(s) mis à jour` : `${eligible.length} message(s) updated`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-2" aria-live="polite">
      <span className="text-sm text-muted-foreground">{locale === "fr" ? `${selected.length} sélectionné(s)` : `${selected.length} selected`}</span>
      <Button type="button" size="sm" variant="outline" disabled={busy || !selectedRows.some((message) => message.status === "NEW")} onClick={() => void mutate("mark-read")}>{locale === "fr" ? "Marquer comme lus" : "Mark as read"}</Button>
      <Button type="button" size="sm" variant="outline" disabled={busy || !selectedRows.some((message) => message.status !== "ARCHIVED")} onClick={() => void mutate("archive")}>{locale === "fr" ? "Archiver" : "Archive"}</Button>
    </div>
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader><TableRow><TableHead className="w-10"><Checkbox aria-label={locale === "fr" ? "Sélectionner tous les messages" : "Select all messages"} checked={allSelected} onCheckedChange={(checked) => setSelected(checked === true ? messages.map((message) => message.id) : [])} /></TableHead><TableHead>{locale === "fr" ? "Expéditeur" : "Sender"}</TableHead><TableHead>{locale === "fr" ? "Objet" : "Subject"}</TableHead><TableHead>{locale === "fr" ? "Statut" : "Status"}</TableHead><TableHead className="hidden md:table-cell">{locale === "fr" ? "Affectation" : "Assignee"}</TableHead><TableHead className="text-right">{locale === "fr" ? "Reçu" : "Received"}</TableHead></TableRow></TableHeader>
        <TableBody>{messages.map((message) => <TableRow key={message.id} className={message.status === "NEW" ? "bg-muted/40" : undefined}><TableCell><Checkbox aria-label={locale === "fr" ? `Sélectionner le message de ${message.name}` : `Select message from ${message.name}`} checked={selected.includes(message.id)} onCheckedChange={(checked) => setSelected((current) => checked === true ? [...current, message.id] : current.filter((id) => id !== message.id))} /></TableCell><TableCell><Link href={`/admin/messages/${message.id}`} className="font-medium hover:underline">{message.name}</Link><div className="text-xs text-muted-foreground">{message.email}</div></TableCell><TableCell className="max-w-80"><Link href={`/admin/messages/${message.id}`} className="block truncate hover:underline">{message.subject || (locale === "fr" ? "Sans objet" : "No subject")}</Link><div className="truncate text-xs text-muted-foreground">{message.body}</div></TableCell><TableCell><MessageStatusBadge status={message.status} locale={locale} /></TableCell><TableCell className="hidden text-muted-foreground md:table-cell">{message.assignee?.name ?? (locale === "fr" ? "Non affecté" : "Unassigned")}</TableCell><TableCell className="whitespace-nowrap text-right text-sm text-muted-foreground">{formatDate.format(new Date(message.createdAt))}</TableCell></TableRow>)}</TableBody>
      </Table>
    </div>
  </div>;
}
