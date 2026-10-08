"use client";

import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Image as ImageIcon, Italic, Link as LinkIcon, List, Minus, Plus, Quote, UnderlineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Textarea } from "@/components/admin/ui/textarea";
import { slugifyBlogTitle } from "@/lib/admin/blog";

type LocaleKey = "FR" | "EN";
type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

type TranslationDraft = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: JSONContent;
  seoTitle: string;
  seoDescription: string;
  isReady: boolean;
};

type BlogDraft = {
  status: PostStatus;
  scheduledAt: string;
  translations: Record<LocaleKey, TranslationDraft>;
  categoryIds: number[];
  tagIds: number[];
  mediaIds: number[];
  coverMediaId: number | null;
};

type Taxonomy = { id: number; nameFr: string; nameEn: string };
type MediaOption = { id: number; secureUrl: string; fileName: string; altTextFr: string | null; altTextEn: string | null };

const emptyDocument: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function RichTextCanvas({
  content,
  onChange,
  media,
  onAttachMedia,
  locale,
}: {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
  media: MediaOption[];
  onAttachMedia: (id: number) => void;
  locale: "fr" | "en";
}) {
  const [showInsert, setShowInsert] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension.configure({ allowBase64: false, HTMLAttributes: { class: "my-8 h-auto max-w-full rounded-lg" } }),
      Underline,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: locale === "fr" ? "Racontez votre histoire…" : "Tell your story…" }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[420px] text-[19px] leading-8 text-foreground outline-none [&_p]:mb-5 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:italic",
        "aria-label": locale === "fr" ? "Contenu de l’article" : "Article content",
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
  });

  if (!editor) return <div className="min-h-[420px] animate-pulse rounded-md bg-muted/40" />;
  const activeEditor = editor;

  function setLink() {
    const previous = activeEditor.getAttributes("link").href as string | undefined;
    const href = window.prompt(locale === "fr" ? "Adresse du lien" : "Link URL", previous ?? "https://");
    if (href === null) return;
    if (!href.trim()) activeEditor.chain().focus().unsetLink().run();
    else activeEditor.chain().focus().setLink({ href }).run();
  }

  return (
    <div className="relative">
      <BubbleMenu editor={editor} className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-lg">
        <Button type="button" size="icon-sm" variant={editor.isActive("bold") ? "secondary" : "ghost"} aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></Button>
        <Button type="button" size="icon-sm" variant={editor.isActive("italic") ? "secondary" : "ghost"} aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></Button>
        <Button type="button" size="icon-sm" variant={editor.isActive("underline") ? "secondary" : "ghost"} aria-label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon /></Button>
        <Button type="button" size="icon-sm" variant={editor.isActive("blockquote") ? "secondary" : "ghost"} aria-label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></Button>
        <Button type="button" size="icon-sm" variant={editor.isActive("bulletList") ? "secondary" : "ghost"} aria-label="List" onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></Button>
        <Button type="button" size="icon-sm" variant={editor.isActive("link") ? "secondary" : "ghost"} aria-label="Link" onClick={setLink}><LinkIcon /></Button>
      </BubbleMenu>

      <div className="absolute -left-12 top-1 z-10 flex items-start gap-2">
        <Button type="button" size="icon" variant="outline" className="rounded-full" aria-label={locale === "fr" ? "Insérer" : "Insert"} onClick={() => setShowInsert((value) => !value)}><Plus /></Button>
        {showInsert ? (
          <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md">
            <Button type="button" size="icon-sm" variant="ghost" aria-label={locale === "fr" ? "Séparateur" : "Divider"} onClick={() => { editor.chain().focus().setHorizontalRule().run(); setShowInsert(false); }}><Minus /></Button>
            {media.length ? <label className="flex items-center gap-1 px-1 text-xs"><ImageIcon className="size-4" aria-hidden="true" /><span className="sr-only">{locale === "fr" ? "Insérer une image" : "Insert image"}</span><select aria-label={locale === "fr" ? "Insérer une image" : "Insert image"} className="max-w-44 bg-background text-xs outline-none" defaultValue="" onChange={(event) => { const selected = media.find((item) => item.id === Number(event.target.value)); if (!selected) return; editor.chain().focus().setImage({ src: selected.secureUrl, alt: locale === "fr" ? selected.altTextFr ?? selected.fileName : selected.altTextEn ?? selected.fileName, title: selected.fileName }).run(); onAttachMedia(selected.id); setShowInsert(false); event.target.value = ""; }}><option value="" disabled>{locale === "fr" ? "Image…" : "Image…"}</option>{media.map((item) => <option key={item.id} value={item.id}>{item.fileName}</option>)}</select></label> : null}
          </div>
        ) : null}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export function BlogEditor({
  postId: initialPostId,
  revision: initialRevision,
  initialDraft,
  categories,
  tags,
  media,
  locale,
}: {
  postId: number | null;
  revision: number;
  initialDraft?: BlogDraft;
  categories: Taxonomy[];
  tags: Taxonomy[];
  media: MediaOption[];
  locale: "fr" | "en";
}) {
  const router = useRouter();
  const [postId, setPostId] = useState(initialPostId);
  const [revision, setRevision] = useState(initialRevision);
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("FR");
  const [draft, setDraft] = useState<BlogDraft>(initialDraft ?? {
    status: "DRAFT",
    scheduledAt: "",
    categoryIds: [],
    tagIds: [],
    mediaIds: [],
    coverMediaId: null,
    translations: {
      FR: { title: "", slug: "", subtitle: "", excerpt: "", content: emptyDocument, seoTitle: "", seoDescription: "", isReady: false },
      EN: { title: "", slug: "", subtitle: "", excerpt: "", content: emptyDocument, seoTitle: "", seoDescription: "", isReady: false },
    },
  });
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [publishOpen, setPublishOpen] = useState(false);
  const signature = JSON.stringify(draft);
  const lastSaved = useRef(signature);
  const saving = useRef(false);

  const persist = useCallback(async (nextDraft: BlogDraft, announce = false) => {
    if (saving.current) return false;
    saving.current = true;
    setSaveState("saving");
    try {
      const response = await fetch(postId ? `/api/admin/blog/${postId}` : "/api/admin/blog", {
        method: postId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...nextDraft, scheduledAt: nextDraft.scheduledAt ? new Date(nextDraft.scheduledAt).toISOString() : null, revision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Save failed");
      const nextId = result.data.id as number;
      const nextRevision = result.data.revision as number;
      setPostId(nextId);
      setRevision(nextRevision);
      lastSaved.current = JSON.stringify(nextDraft);
      setSaveState("saved");
      if (!postId) router.replace(`/admin/blog/${nextId}/edit`);
      if (announce) toast.success(locale === "fr" ? "Article enregistré" : "Post saved");
      return true;
    } catch (error) {
      setSaveState("error");
      if (announce) toast.error(error instanceof Error ? error.message : "Save failed");
      return false;
    } finally {
      saving.current = false;
    }
  }, [locale, postId, revision, router]);

  useEffect(() => {
    if (signature === lastSaved.current) return;
    const timer = window.setTimeout(() => void persist(draft), 1_200);
    return () => window.clearTimeout(timer);
  }, [draft, persist, signature]);

  function updateTranslation(localeKey: LocaleKey, patch: Partial<TranslationDraft>) {
    setDraft((current) => ({
      ...current,
      translations: { ...current.translations, [localeKey]: { ...current.translations[localeKey], ...patch } },
    }));
  }

  function updateTitle(title: string) {
    const translation = draft.translations[activeLocale];
    updateTranslation(activeLocale, {
      title,
      slug: !translation.slug ? slugifyBlogTitle(title) : translation.slug,
    });
  }

  function toggleTaxonomy(field: "categoryIds" | "tagIds", id: number, checked: boolean) {
    setDraft((current) => ({
      ...current,
      [field]: checked ? [...current[field], id] : current[field].filter((value) => value !== id),
    }));
  }

  function attachMedia(id: number) {
    setDraft((current) => current.mediaIds.includes(id) ? current : { ...current, mediaIds: [...current.mediaIds, id] });
  }

  async function publish(status: PostStatus) {
    const nextDraft = { ...draft, status };
    setDraft(nextDraft);
    if (await persist(nextDraft, true)) setPublishOpen(false);
  }

  const translation = draft.translations[activeLocale];
  const language = activeLocale === "FR" ? "fr" : "en";

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="sticky top-0 z-20 mb-8 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Tabs value={activeLocale} onValueChange={(value) => setActiveLocale(value as LocaleKey)}>
            <TabsList><TabsTrigger value="FR">FR</TabsTrigger><TabsTrigger value="EN">EN</TabsTrigger></TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {saveState === "saving" ? (locale === "fr" ? "Enregistrement…" : "Saving…") : saveState === "error" ? (locale === "fr" ? "Échec de l’enregistrement" : "Save failed") : (locale === "fr" ? "Enregistré" : "Saved")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void persist(draft, true)}>{locale === "fr" ? "Enregistrer" : "Save"}</Button>
          <Button type="button" onClick={() => setPublishOpen(true)}>{locale === "fr" ? "Publier" : "Publish"}</Button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="mx-auto w-full max-w-[740px] px-10 pb-24">
          <input
            value={translation.title}
            onChange={(event) => updateTitle(event.target.value)}
            placeholder={language === "fr" ? "Titre" : "Title"}
            aria-label={language === "fr" ? "Titre de l’article" : "Post title"}
            className="mb-3 w-full border-0 bg-transparent font-serif text-5xl leading-tight outline-none placeholder:text-muted-foreground/50"
          />
          <input
            value={translation.subtitle}
            onChange={(event) => updateTranslation(activeLocale, { subtitle: event.target.value })}
            placeholder={language === "fr" ? "Sous-titre" : "Subtitle"}
            aria-label={language === "fr" ? "Sous-titre" : "Subtitle"}
            className="mb-10 w-full border-0 bg-transparent font-serif text-2xl text-muted-foreground outline-none placeholder:text-muted-foreground/40"
          />
          <RichTextCanvas key={activeLocale} content={translation.content} onChange={(content) => updateTranslation(activeLocale, { content })} media={media} onAttachMedia={attachMedia} locale={language} />
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="font-semibold">{locale === "fr" ? "Paramètres de l’histoire" : "Story settings"}</h2>
            <Label htmlFor="cover-media">{locale === "fr" ? "Image de couverture" : "Cover image"}</Label>
            <select id="cover-media" className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs" value={draft.coverMediaId ?? ""} onChange={(event) => { const id = event.target.value ? Number(event.target.value) : null; setDraft((current) => ({ ...current, coverMediaId: id, mediaIds: id && !current.mediaIds.includes(id) ? [...current.mediaIds, id] : current.mediaIds })); }}><option value="">{locale === "fr" ? "Aucune" : "None"}</option>{media.map((item) => <option key={item.id} value={item.id}>{item.fileName}</option>)}</select>
            <Label htmlFor="post-slug">Slug</Label>
            <Input id="post-slug" value={translation.slug} onChange={(event) => updateTranslation(activeLocale, { slug: slugifyBlogTitle(event.target.value) })} />
            <Label htmlFor="post-excerpt">{locale === "fr" ? "Résumé" : "Excerpt"}</Label>
            <Textarea id="post-excerpt" value={translation.excerpt} maxLength={500} onChange={(event) => updateTranslation(activeLocale, { excerpt: event.target.value })} />
            <div className="flex items-center gap-2">
              <Checkbox id="locale-ready" checked={translation.isReady} onCheckedChange={(checked) => updateTranslation(activeLocale, { isReady: checked === true })} />
              <Label htmlFor="locale-ready">{locale === "fr" ? "Traduction prête" : "Translation ready"}</Label>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="font-semibold">SEO</h2>
            <Label htmlFor="seo-title">SEO title</Label>
            <Input id="seo-title" value={translation.seoTitle} maxLength={70} onChange={(event) => updateTranslation(activeLocale, { seoTitle: event.target.value })} />
            <Label htmlFor="seo-description">SEO description</Label>
            <Textarea id="seo-description" value={translation.seoDescription} maxLength={170} onChange={(event) => updateTranslation(activeLocale, { seoDescription: event.target.value })} />
          </div>

          {categories.length ? <div className="space-y-2 rounded-lg border p-4"><h2 className="font-semibold">{locale === "fr" ? "Catégories" : "Categories"}</h2>{categories.map((item) => <label key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={draft.categoryIds.includes(item.id)} onCheckedChange={(checked) => toggleTaxonomy("categoryIds", item.id, checked === true)} />{locale === "fr" ? item.nameFr : item.nameEn}</label>)}</div> : null}
          {tags.length ? <div className="space-y-2 rounded-lg border p-4"><h2 className="font-semibold">Tags</h2>{tags.map((item) => <label key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={draft.tagIds.includes(item.id)} onCheckedChange={(checked) => toggleTaxonomy("tagIds", item.id, checked === true)} />{locale === "fr" ? item.nameFr : item.nameEn}</label>)}</div> : null}
        </aside>
      </div>

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "fr" ? "Prêt à publier ?" : "Ready to publish?"}</DialogTitle>
            <DialogDescription>{locale === "fr" ? "Vérifiez les traductions prêtes, puis publiez maintenant ou programmez une date." : "Review ready translations, then publish now or schedule a date."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="schedule-date">{locale === "fr" ? "Date de publication" : "Publication date"}</Label>
            <Input id="schedule-date" type="datetime-local" value={draft.scheduledAt} onChange={(event) => setDraft((current) => ({ ...current, scheduledAt: event.target.value }))} />
            <div className="text-sm text-muted-foreground">FR: {draft.translations.FR.isReady ? "✓" : "—"} · EN: {draft.translations.EN.isReady ? "✓" : "—"}</div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => void publish("DRAFT")}>{locale === "fr" ? "Garder en brouillon" : "Keep draft"}</Button>
            {draft.scheduledAt ? <Button type="button" variant="secondary" onClick={() => void publish("SCHEDULED")}>{locale === "fr" ? "Programmer" : "Schedule"}</Button> : null}
            <Button type="button" onClick={() => void publish("PUBLISHED")}>{locale === "fr" ? "Publier maintenant" : "Publish now"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type { BlogDraft };
