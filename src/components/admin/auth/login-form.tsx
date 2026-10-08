"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Checkbox } from "@/components/admin/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import { cn } from "@/lib/admin/utils";

const LOGIN_IMAGES = [
  "/images/home/info-lan-hero.webp",
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
];

const copy = {
  fr: {
    subtitle: "Connectez-vous à l'administration INFO-L@N",
    email: "Adresse e-mail",
    password: "Mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    submit: "Se connecter",
    submitting: "Connexion…",
    error: "Impossible de vous connecter.",
    legal: "En continuant, vous acceptez les conditions et la politique de confidentialité.",
  },
  en: {
    subtitle: "Sign in to the INFO-L@N administration",
    email: "Email address",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign in",
    submitting: "Signing in…",
    error: "Unable to sign in.",
    legal: "By continuing, you agree to the terms and privacy policy.",
  },
} as const;

export function LoginForm({ className }: { className?: string }) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const labels = copy[locale];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImageIndex((current) => (current + 1) % LOGIN_IMAGES.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const result = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(result.error?.message || labels.error);
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <Image
                  src="/images/info-lan-logo.webp"
                  alt="INFO-L@N"
                  width={1080}
                  height={430}
                  priority
                  className="mb-4 h-16 w-auto max-w-full object-contain sm:h-20 md:h-24"
                />
                <h1 className="text-balance text-sm font-normal text-muted-foreground">
                  {labels.subtitle}
                </h1>
              </div>
              {error ? (
                <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <Field>
                <FieldLabel htmlFor="email">{labels.email}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{labels.password}</FieldLabel>
                  <Link
                    href="/admin/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {labels.forgot}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label htmlFor="remember" className="text-sm font-medium leading-none">
                    {labels.remember}
                  </label>
                </div>
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? labels.submitting : labels.submit}
                </Button>
              </Field>
              <FieldDescription className="text-center">{labels.legal}</FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden min-h-145 overflow-hidden bg-muted md:block">
            {LOGIN_IMAGES.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 448px, 0px"
                className={cn(
                  "object-cover transition-opacity duration-1000 ease-in-out",
                  index === currentImageIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
