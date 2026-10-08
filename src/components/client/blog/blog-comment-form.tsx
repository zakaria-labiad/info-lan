"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/client/shared/button";
import { Input } from "@/components/client/shared/input";
import { Textarea } from "@/components/client/shared/textarea";

type Labels = {
  title: string;
  note: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
};

export function BlogCommentForm({ labels, slug, locale }: { labels: Labels; slug: string; locale: "fr" | "en" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
          locale: locale.toUpperCase(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      form.reset();
      setStatus("success");
      setMessage(locale === "fr" ? "Votre commentaire a été envoyé et sera publié après modération." : "Your comment was submitted and will appear after moderation.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : (locale === "fr" ? "Impossible d’envoyer le commentaire." : "Unable to submit the comment."));
    }
  }

  return (
    <section id="comment-form" className="grid gap-8 rounded-md border bg-transparent px-6 py-5 shadow-sm md:px-9 md:py-8">
      <div className="grid gap-2">
        <h3 className="text-3xl font-medium leading-8 md:text-header-3">{labels.title}</h3>
        <p className="text-sm leading-6 text-foreground-muted">{labels.note}</p>
      </div>
      <form className="grid gap-4" onSubmit={submit}>
        <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
        <div className="grid w-full gap-4 md:grid-cols-2 lg:gap-x-5">
          <Input id="fullName" name="fullName" label={labels.fullName} required autoComplete="name" />
          <Input id="email" name="email" label={labels.email} type="email" required autoComplete="email" />
        </div>
        <Input id="subject" name="subject" label={labels.subject} type="text" required />
        <Textarea id="message" name="message" label={labels.message} rows={6} minLength={10} required />
        <div className="flex justify-end"><Button type="submit" className="w-fit" disabled={status === "sending"}>{status === "sending" ? (locale === "fr" ? "Envoi…" : "Sending…") : labels.submit}</Button></div>
        <p aria-live="polite" className={status === "error" ? "text-sm text-red-700" : "text-sm text-foreground-muted"}>{message}</p>
      </form>
    </section>
  );
}
