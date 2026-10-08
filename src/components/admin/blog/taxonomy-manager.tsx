"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { slugifyBlogTitle } from "@/lib/admin/blog";

type TaxonomyItem = {
  id: number;
  nameFr: string;
  nameEn: string;
  slugFr: string;
  slugEn: string;
  descriptionFr?: string | null;
  descriptionEn?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

const empty = { nameFr: "", nameEn: "", slugFr: "", slugEn: "", descriptionFr: "", descriptionEn: "", sortOrder: 0, isActive: true };

export function TaxonomyManager({ kind, items, locale, apiBase }: { kind: "categories" | "tags"; items: TaxonomyItem[]; locale: "fr" | "en"; apiBase?: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const isCategory = kind === "categories";
  const endpoint = apiBase ?? `/api/admin/blog/${kind}`;

  function startEdit(item: TaxonomyItem) {
    setEditingId(item.id);
    setForm({
      nameFr: item.nameFr,
      nameEn: item.nameEn,
      slugFr: item.slugFr,
      slugEn: item.slugEn,
      descriptionFr: item.descriptionFr ?? "",
      descriptionEn: item.descriptionEn ?? "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const body = isCategory ? form : { nameFr: form.nameFr, nameEn: form.nameEn, slugFr: form.slugFr, slugEn: form.slugEn };
      const response = await fetch(`${endpoint}${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      toast.success(locale === "fr" ? "Enregistré" : "Saved");
      setEditingId(null);
      setForm(empty);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(locale === "fr" ? "Supprimer cet élément ?" : "Delete this item?")) return;
    setBusy(true);
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      toast.success(locale === "fr" ? "Supprimé" : "Deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
    <form className="h-fit space-y-4 rounded-lg border bg-card p-5 shadow-sm" onSubmit={submit}>
      <div className="flex items-center justify-between"><h2 className="font-semibold">{editingId ? (locale === "fr" ? "Modifier" : "Edit") : (locale === "fr" ? "Ajouter" : "Add")}</h2>{editingId ? <Button type="button" size="icon-sm" variant="ghost" aria-label={locale === "fr" ? "Annuler" : "Cancel"} onClick={() => { setEditingId(null); setForm(empty); }}><X /></Button> : null}</div>
      <div><Label htmlFor="name-fr">Nom FR</Label><Input id="name-fr" value={form.nameFr} onChange={(event) => setForm((value) => ({ ...value, nameFr: event.target.value, slugFr: value.slugFr || slugifyBlogTitle(event.target.value) }))} required /></div>
      <div><Label htmlFor="slug-fr">Slug FR</Label><Input id="slug-fr" value={form.slugFr} onChange={(event) => setForm((value) => ({ ...value, slugFr: slugifyBlogTitle(event.target.value) }))} required /></div>
      <div><Label htmlFor="name-en">Name EN</Label><Input id="name-en" value={form.nameEn} onChange={(event) => setForm((value) => ({ ...value, nameEn: event.target.value, slugEn: value.slugEn || slugifyBlogTitle(event.target.value) }))} required /></div>
      <div><Label htmlFor="slug-en">Slug EN</Label><Input id="slug-en" value={form.slugEn} onChange={(event) => setForm((value) => ({ ...value, slugEn: slugifyBlogTitle(event.target.value) }))} required /></div>
      {isCategory ? <>
        <div><Label htmlFor="description-fr">Description FR</Label><Textarea id="description-fr" value={form.descriptionFr} onChange={(event) => setForm((value) => ({ ...value, descriptionFr: event.target.value }))} /></div>
        <div><Label htmlFor="description-en">Description EN</Label><Textarea id="description-en" value={form.descriptionEn} onChange={(event) => setForm((value) => ({ ...value, descriptionEn: event.target.value }))} /></div>
        <div><Label htmlFor="sort-order">{locale === "fr" ? "Ordre" : "Order"}</Label><Input id="sort-order" type="number" min={0} value={form.sortOrder} onChange={(event) => setForm((value) => ({ ...value, sortOrder: Number(event.target.value) }))} /></div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.isActive} onCheckedChange={(checked) => setForm((value) => ({ ...value, isActive: checked === true }))} />{locale === "fr" ? "Active" : "Active"}</label>
      </> : null}
      <Button type="submit" className="w-full" disabled={busy}><Plus />{editingId ? (locale === "fr" ? "Mettre à jour" : "Update") : (locale === "fr" ? "Ajouter" : "Add")}</Button>
    </form>

    <div className="overflow-hidden rounded-lg border bg-card">
      {items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b p-4 last:border-b-0">
        <div><div className="font-medium">{locale === "fr" ? item.nameFr : item.nameEn}</div><div className="text-xs text-muted-foreground">/{locale === "fr" ? item.slugFr : item.slugEn}</div></div>
        <div className="flex gap-1"><Button type="button" size="icon-sm" variant="ghost" aria-label={locale === "fr" ? "Modifier" : "Edit"} onClick={() => startEdit(item)}><Pencil /></Button><Button type="button" size="icon-sm" variant="ghost" aria-label={locale === "fr" ? "Supprimer" : "Delete"} disabled={busy} onClick={() => void remove(item.id)}><Trash2 /></Button></div>
      </div>)}
      {!items.length ? <p className="p-8 text-center text-sm text-muted-foreground">{locale === "fr" ? "Aucun élément" : "No items"}</p> : null}
    </div>
  </div>;
}
