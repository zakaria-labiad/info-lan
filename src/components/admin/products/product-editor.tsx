"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Textarea } from "@/components/admin/ui/textarea";
import { slugifyBlogTitle } from "@/lib/admin/blog";

type Translation = { title: string; slug: string; shortDescription: string; description: string; seoTitle: string; seoDescription: string; isReady: boolean };
export type ProductDraft = { status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; family: string; availability: string; isBestSeller: boolean; sortOrder: number; specifications: { name: string; value: string }[]; options: string[]; translations: { FR: Translation; EN: Translation }; categoryIds: number[]; relatedProductIds: number[]; mediaIds: number[] };
type Named = { id: number; name: string };
type MediaItem = { id: number; fileName: string; altTextFr: string | null; altTextEn: string | null };
const emptyTranslation = (): Translation => ({ title: "", slug: "", shortDescription: "", description: "", seoTitle: "", seoDescription: "", isReady: false });

export function ProductEditor({ productId, revision, initialDraft, categories, products, media, locale }: { productId: number | null; revision: number; initialDraft?: ProductDraft; categories: Named[]; products: Named[]; media: MediaItem[]; locale: "fr" | "en" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<ProductDraft>(initialDraft ?? { status: "DRAFT", family: "", availability: "", isBestSeller: false, sortOrder: 0, specifications: [], options: [], translations: { FR: emptyTranslation(), EN: emptyTranslation() }, categoryIds: [], relatedProductIds: [], mediaIds: [] });
  const [specText, setSpecText] = useState(draft.specifications.map((item) => `${item.name}: ${item.value}`).join("\n"));
  const [optionText, setOptionText] = useState(draft.options.join("\n"));

  function updateTranslation(key: "FR" | "EN", patch: Partial<Translation>) { setDraft((value) => ({ ...value, translations: { ...value.translations, [key]: { ...value.translations[key], ...patch } } })); }
  function toggle(field: "categoryIds" | "relatedProductIds" | "mediaIds", id: number, checked: boolean) { setDraft((value) => ({ ...value, [field]: checked ? [...value[field], id] : value[field].filter((current) => current !== id) })); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const payload = { ...draft, revision, specifications: specText.split("\n").map((line) => line.split(":" , 2).map((part) => part.trim())).filter(([name, value]) => name && value).map(([name, value]) => ({ name, value })), options: optionText.split("\n").map((value) => value.trim()).filter(Boolean) };
    try {
      const response = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", { method: productId ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Save failed");
      toast.success(locale === "fr" ? "Produit enregistré" : "Product saved");
      router.replace(`/admin/products/${result.data.id}/edit`); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Save failed"); } finally { setBusy(false); }
  }

  return <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={save}>
    <div className="space-y-6 rounded-md border bg-card p-6 shadow-sm">
      <Tabs defaultValue="FR"><TabsList><TabsTrigger value="FR">FR</TabsTrigger><TabsTrigger value="EN">EN</TabsTrigger></TabsList>{(["FR", "EN"] as const).map((key) => { const value = draft.translations[key]; return <TabsContent value={key} key={key} className="space-y-4 pt-4">
        <div><Label htmlFor={`title-${key}`}>{locale === "fr" ? "Titre" : "Title"}</Label><Input id={`title-${key}`} value={value.title} onChange={(event) => updateTranslation(key, { title: event.target.value, slug: value.slug || slugifyBlogTitle(event.target.value) })} /></div>
        <div><Label htmlFor={`slug-${key}`}>Slug</Label><Input id={`slug-${key}`} value={value.slug} onChange={(event) => updateTranslation(key, { slug: slugifyBlogTitle(event.target.value) })} /></div>
        <div><Label htmlFor={`short-${key}`}>{locale === "fr" ? "Description courte" : "Short description"}</Label><Textarea id={`short-${key}`} value={value.shortDescription} onChange={(event) => updateTranslation(key, { shortDescription: event.target.value })} /></div>
        <div><Label htmlFor={`description-${key}`}>{locale === "fr" ? "Description" : "Description"}</Label><Textarea id={`description-${key}`} rows={10} value={value.description} onChange={(event) => updateTranslation(key, { description: event.target.value })} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor={`seo-title-${key}`}>SEO title</Label><Input id={`seo-title-${key}`} value={value.seoTitle} onChange={(event) => updateTranslation(key, { seoTitle: event.target.value })} /></div><div><Label htmlFor={`seo-description-${key}`}>SEO description</Label><Input id={`seo-description-${key}`} value={value.seoDescription} onChange={(event) => updateTranslation(key, { seoDescription: event.target.value })} /></div></div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={value.isReady} onCheckedChange={(checked) => updateTranslation(key, { isReady: checked === true })} />{locale === "fr" ? "Traduction prête" : "Translation ready"}</label>
      </TabsContent>; })}</Tabs>
      <div className="grid gap-4 md:grid-cols-2"><div><Label htmlFor="specifications">{locale === "fr" ? "Spécifications (une par ligne: nom: valeur)" : "Specifications (one per line: name: value)"}</Label><Textarea id="specifications" rows={8} value={specText} onChange={(event) => setSpecText(event.target.value)} /></div><div><Label htmlFor="options">{locale === "fr" ? "Options (une par ligne)" : "Options (one per line)"}</Label><Textarea id="options" rows={8} value={optionText} onChange={(event) => setOptionText(event.target.value)} /></div></div>
    </div>
    <aside className="space-y-5">
      <div className="space-y-3 rounded-md border bg-card p-4"><Label htmlFor="status">Status</Label><select id="status" className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={draft.status} onChange={(event) => setDraft((value) => ({ ...value, status: event.target.value as ProductDraft["status"] }))}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select><Label htmlFor="family">{locale === "fr" ? "Famille" : "Family"}</Label><Input id="family" value={draft.family} onChange={(event) => setDraft((value) => ({ ...value, family: event.target.value }))} /><Label htmlFor="availability">{locale === "fr" ? "Disponibilité" : "Availability"}</Label><Input id="availability" value={draft.availability} onChange={(event) => setDraft((value) => ({ ...value, availability: event.target.value }))} /><Label htmlFor="sort">{locale === "fr" ? "Ordre" : "Order"}</Label><Input id="sort" type="number" min={0} value={draft.sortOrder} onChange={(event) => setDraft((value) => ({ ...value, sortOrder: Number(event.target.value) }))} /><label className="flex items-center gap-2 text-sm"><Checkbox checked={draft.isBestSeller} onCheckedChange={(checked) => setDraft((value) => ({ ...value, isBestSeller: checked === true }))} />Best seller</label></div>
      <ChoiceList title={locale === "fr" ? "Catégories" : "Categories"} items={categories} selected={draft.categoryIds} onToggle={(id, checked) => toggle("categoryIds", id, checked)} />
      <ChoiceList title={locale === "fr" ? "Produits liés" : "Related products"} items={products} selected={draft.relatedProductIds} onToggle={(id, checked) => toggle("relatedProductIds", id, checked)} />
      <ChoiceList title={locale === "fr" ? "Médias (le premier est principal)" : "Media (first is primary)"} items={media.map((item) => ({ id: item.id, name: (locale === "fr" ? item.altTextFr : item.altTextEn) || item.fileName }))} selected={draft.mediaIds} onToggle={(id, checked) => toggle("mediaIds", id, checked)} />
      <Button type="submit" className="w-full" disabled={busy}><Save />{locale === "fr" ? "Enregistrer" : "Save"}</Button>
    </aside>
  </form>;
}

function ChoiceList({ title, items, selected, onToggle }: { title: string; items: Named[]; selected: number[]; onToggle: (id: number, checked: boolean) => void }) { return <div className="max-h-64 space-y-2 overflow-auto rounded-md border bg-card p-4"><h2 className="font-semibold">{title}</h2>{items.map((item) => <label key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={selected.includes(item.id)} onCheckedChange={(checked) => onToggle(item.id, checked === true)} />{item.name}</label>)}{!items.length ? <p className="text-sm text-muted-foreground">—</p> : null}</div>; }
