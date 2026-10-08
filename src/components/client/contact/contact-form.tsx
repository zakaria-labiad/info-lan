"use client";

import { useLocale } from "next-intl";
import { useState, type FormEvent } from "react";

import { Button, Input, Textarea } from "@/components/client/shared";

type ContactFormLabels = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
};

export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("full-name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
          locale,
        }),
      });
      if (!response.ok) throw new Error("contact-submit-failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="grid w-full gap-y-6 md:gap-y-8 xl:gap-y-10" onSubmit={submit}>
      <div className="grid w-full gap-x-4 gap-y-6 sm:grid-cols-2 lg:gap-x-5">
        <Input id="full-name" name="full-name" label={labels.fullName} type="text" required autoComplete="name" />
        <Input id="email" name="email" label={labels.email} type="email" required autoComplete="email" />
      </div>
      <Input id="subject" name="subject" label={labels.subject} type="text" required />
      <Textarea id="message" name="message" label={labels.message} rows={6} required />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Button className="w-full lg:w-fit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (locale === "fr" ? "Envoi…" : "Sending…") : labels.submit}
      </Button>
      <p className="min-h-6 text-sm" aria-live="polite">
        {status === "success"
          ? locale === "fr" ? "Votre message a bien été envoyé." : "Your message was sent successfully."
          : status === "error"
            ? locale === "fr" ? "L’envoi a échoué. Veuillez réessayer." : "Sending failed. Please try again."
            : ""}
      </p>
    </form>
  );
}
