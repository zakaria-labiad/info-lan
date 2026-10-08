"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";

export function CommentModerationActions({ id, locale }: { id: number; locale: "fr" | "en" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function moderate(status: "APPROVED" | "HIDDEN" | "SPAM" | "DELETED") {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      toast.success(locale === "fr" ? "Commentaire modéré" : "Comment moderated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return <div className="flex flex-wrap gap-1">
    <Button type="button" size="sm" disabled={busy} onClick={() => void moderate("APPROVED")}>{locale === "fr" ? "Approuver" : "Approve"}</Button>
    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void moderate("HIDDEN")}>{locale === "fr" ? "Masquer" : "Hide"}</Button>
    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void moderate("SPAM")}>Spam</Button>
    <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={() => void moderate("DELETED")}>{locale === "fr" ? "Supprimer" : "Delete"}</Button>
  </div>;
}
