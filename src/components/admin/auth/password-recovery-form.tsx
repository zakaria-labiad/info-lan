"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";

export function PasswordRecoveryForm({ mode }: { mode: "forgot" | "reset" }) {
  const search = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError(false);
    const form = event.currentTarget; const data = new FormData(form);
    const payload = mode === "forgot" ? { email: data.get("email") } : { token: search.get("token"), password: data.get("password") };
    try {
      const response = await fetch(`/api/admin/auth/${mode === "forgot" ? "forgot-password" : "reset-password"}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error?.message ?? "Request failed");
      setMessage(mode === "forgot" ? "If the account exists, a reset link has been sent." : "Password updated. You can now sign in."); form.reset();
    } catch (reason) { setError(true); setMessage(reason instanceof Error ? reason.message : "Request failed"); } finally { setBusy(false); }
  }

  return <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center p-4"><Card className="w-full max-w-md p-5"><CardHeader><CardTitle>{mode === "forgot" ? "Forgot password" : "Reset password"}</CardTitle><CardDescription>{mode === "forgot" ? "Enter your administrator email address." : "Choose a strong replacement password."}</CardDescription></CardHeader><CardContent className="p-2"><form className="space-y-4" onSubmit={submit}>{mode === "forgot" ? <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div> : <div><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required /></div>}<Button className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "forgot" ? "Send reset link" : "Reset password"}</Button><p aria-live="polite" className={error ? "text-sm text-red-700" : "text-sm text-muted-foreground"}>{message}</p><Button asChild variant="link" className="w-full"><Link href="/admin/login">Back to login</Link></Button></form></CardContent></Card></div>;
}
