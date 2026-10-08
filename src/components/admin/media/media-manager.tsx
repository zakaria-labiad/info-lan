"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { isAllowedMediaUpload } from "@/lib/admin/media";

type MediaItem = { id: number; secureUrl: string; fileName: string; width: number | null; height: number | null; altTextFr: string | null; altTextEn: string | null; _count: { blogPosts: number; products: number } };

export function MediaManager({ items, locale }: { items: MediaItem[]; locale: "fr" | "en" }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const input = form.elements.namedItem("file") as HTMLInputElement; const file = input.files?.[0];
    if (!file || !isAllowedMediaUpload(file)) { toast.error(locale === "fr" ? "Image JPG, PNG, WebP ou AVIF de 8 Mo maximum." : "Use a JPG, PNG, WebP, or AVIF image up to 8 MB."); return; }
    setBusy(true);
    try {
      const signed = await fetch("/api/admin/media/sign", { method: "POST" }); const signedResult = await signed.json(); if (!signed.ok) throw new Error(signedResult.error?.message ?? "Upload configuration failed");
      const values = signedResult.data; const body = new FormData(); body.set("file", file); body.set("api_key", values.apiKey); body.set("timestamp", String(values.timestamp)); body.set("signature", values.signature); body.set("folder", values.folder); body.set("allowed_formats", values.allowed_formats); body.set("transformation", values.transformation);
      const cloud = await fetch(`https://api.cloudinary.com/v1_1/${values.cloudName}/image/upload`, { method: "POST", body }); const cloudResult = await cloud.json(); if (!cloud.ok) throw new Error(cloudResult.error?.message ?? "Upload failed");
      const register = await fetch("/api/admin/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ publicId: cloudResult.public_id, altTextFr: new FormData(form).get("altTextFr"), altTextEn: new FormData(form).get("altTextEn") }) }); const result = await register.json(); if (!register.ok) throw new Error(result.error?.message ?? "Media registration failed");
      form.reset(); toast.success(locale === "fr" ? "Média ajouté" : "Media added"); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed"); } finally { setBusy(false); }
  }
  async function remove(id: number) { if (!window.confirm(locale === "fr" ? "Supprimer ce média ?" : "Delete this media?")) return; setBusy(true); try { const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" }); const result = await response.json(); if (!response.ok) throw new Error(result.error?.message ?? "Delete failed"); toast.success(locale === "fr" ? "Média supprimé" : "Media deleted"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Delete failed"); } finally { setBusy(false); } }
  return <div className="space-y-6"><form onSubmit={upload} className="grid gap-4 rounded-md border bg-card p-5 shadow-sm md:grid-cols-2"><div><Label htmlFor="media-file">{locale === "fr" ? "Image" : "Image"}</Label><Input id="media-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></div><div className="flex items-end"><Button type="submit" disabled={busy}><ImagePlus />{locale === "fr" ? "Téléverser" : "Upload"}</Button></div><div><Label htmlFor="alt-fr">Texte alternatif FR</Label><Input id="alt-fr" name="altTextFr" /></div><div><Label htmlFor="alt-en">Alternative text EN</Label><Input id="alt-en" name="altTextEn" /></div></form><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-md border bg-card"><div className="relative aspect-video bg-muted"><Image src={item.secureUrl} alt={(locale === "fr" ? item.altTextFr : item.altTextEn) || item.fileName} fill sizes="(min-width:1280px) 25vw, 50vw" className="object-cover" /></div><div className="space-y-2 p-3"><div className="truncate text-sm font-medium">{item.fileName}</div><div className="text-xs text-muted-foreground">{item.width}×{item.height} · {item._count.blogPosts + item._count.products} refs</div><Button type="button" size="sm" variant="outline" disabled={busy || item._count.blogPosts + item._count.products > 0} onClick={() => void remove(item.id)}><Trash2 />{locale === "fr" ? "Supprimer" : "Delete"}</Button></div></article>)}</div></div>;
}
