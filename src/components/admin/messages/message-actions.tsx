"use client";

import { Archive, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";

type Assignee = { id: number; name: string };

async function mutateMessage(id: number, payload: Record<string, unknown>) {
  const response = await fetch(`/api/admin/messages/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
  return result.data;
}

export function MessageActions({
  id,
  revision,
  status,
  assignedToId,
  assignees,
  locale,
  initialSubject,
}: {
  id: number;
  revision: number;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  assignedToId: number | null;
  assignees: Assignee[];
  locale: "fr" | "en";
  initialSubject: string;
}) {
  const router = useRouter();
  const markedRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [replySubject, setReplySubject] = useState(initialSubject);
  const [replyBody, setReplyBody] = useState("");
  const [replyKey, setReplyKey] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "NEW" || markedRef.current) return;
    markedRef.current = true;
    void mutateMessage(id, { action: "mark-read", revision }).then(() => router.refresh()).catch(() => {
      markedRef.current = false;
    });
  }, [id, revision, router, status]);

  async function assign(value: string) {
    setBusy(true);
    try {
      await mutateMessage(id, {
        action: "assign",
        assignedToId: value ? Number(value) : null,
        revision,
      });
      toast.success(locale === "fr" ? "Affectation mise à jour" : "Assignment updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      await mutateMessage(id, { action: "note", body: note });
      setNote("");
      toast.success(locale === "fr" ? "Note ajoutée" : "Note added");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    setBusy(true);
    try {
      await mutateMessage(id, { action: "archive", revision });
      toast.success(locale === "fr" ? "Message archivé" : "Message archived");
      router.push("/admin/messages");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
      setBusy(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!replySubject.trim() || !replyBody.trim()) return;
    setBusy(true);
    const idempotencyKey = replyKey ?? crypto.randomUUID();
    setReplyKey(idempotencyKey);
    try {
      const response = await fetch(`/api/admin/messages/${id}/reply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject: replySubject, body: replyBody, idempotencyKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      setReplyBody("");
      setReplyKey(null);
      toast.success(locale === "fr" ? "Réponse envoyée" : "Reply sent");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="message-assignee">{locale === "fr" ? "Affecté à" : "Assigned to"}</Label>
        <select
          id="message-assignee"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          defaultValue={assignedToId ?? ""}
          disabled={busy || status === "ARCHIVED"}
          onChange={(event) => void assign(event.target.value)}
        >
          <option value="">{locale === "fr" ? "Non affecté" : "Unassigned"}</option>
          {assignees.map((assignee) => <option key={assignee.id} value={assignee.id}>{assignee.name}</option>)}
        </select>
      </div>

      <form className="space-y-2" onSubmit={addNote}>
        <Label htmlFor="internal-note">{locale === "fr" ? "Note interne" : "Internal note"}</Label>
        <Textarea
          id="internal-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={5_000}
          placeholder={locale === "fr" ? "Visible uniquement par l’équipe…" : "Visible to the team only…"}
        />
        <Button type="submit" size="sm" disabled={busy || !note.trim()}>
          <Save aria-hidden="true" /> {locale === "fr" ? "Ajouter" : "Add note"}
        </Button>
      </form>

      <form className="space-y-2 border-t pt-5" onSubmit={sendReply}>
        <Label htmlFor="reply-subject">{locale === "fr" ? "Objet de la réponse" : "Reply subject"}</Label>
        <input
          id="reply-subject"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          value={replySubject}
          onChange={(event) => setReplySubject(event.target.value)}
          maxLength={200}
          required
        />
        <Label htmlFor="reply-body">{locale === "fr" ? "Réponse au client" : "Reply to client"}</Label>
        <Textarea
          id="reply-body"
          value={replyBody}
          onChange={(event) => setReplyBody(event.target.value)}
          maxLength={20_000}
          rows={7}
          required
        />
        <Button type="submit" className="w-full" disabled={busy || !replySubject.trim() || !replyBody.trim()}>
          <Send aria-hidden="true" /> {locale === "fr" ? "Envoyer la réponse" : "Send reply"}
        </Button>
      </form>

      {status !== "ARCHIVED" ? (
        <Button type="button" variant="outline" className="w-full" disabled={busy} onClick={() => void archive()}>
          <Archive aria-hidden="true" /> {locale === "fr" ? "Archiver" : "Archive"}
        </Button>
      ) : null}
    </div>
  );
}
