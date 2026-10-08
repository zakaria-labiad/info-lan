"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/i18n/shared/config";
import { usePathname, useRouter } from "@/i18n/client/navigation";
import {
  INFO_LAN_LOCALE_STORAGE_KEY,
  resolvePreferredLocale,
} from "@/i18n/client/locale-preference";
import { cn } from "@/lib/shared/utils";

type LanguageSwitcherProps = {
  className?: string;
  color?: "white" | "primary";
};

const triggerColorClasses = {
  white: "text-white",
  primary: "text-primary",
} satisfies Record<NonNullable<LanguageSwitcherProps["color"]>, string>;

export function LanguageSwitcher({
  className,
  color = "white",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const t = useTranslations("header.language");
  const languageLabels = useTranslations("common.languages");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const preferenceResolved = useRef(false);
  const triggerColorClass = triggerColorClasses[color];

  const navigateToLocale = useCallback((locale: Locale) => {
    startTransition(() => {
      const query = searchParams.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      router.replace(href, { locale });
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (preferenceResolved.current) return;
    preferenceResolved.current = true;

    let savedLocale: string | null = null;

    try {
      savedLocale = window.localStorage.getItem(INFO_LAN_LOCALE_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy modes; browser preference still works.
    }

    const preferredLocale = resolvePreferredLocale(
      savedLocale,
      window.navigator?.language,
    );

    if (preferredLocale !== currentLocale) {
      navigateToLocale(preferredLocale);
    }
  }, [currentLocale, navigateToLocale]);

  function changeLanguage(locale: Locale) {
    try {
      window.localStorage.setItem(INFO_LAN_LOCALE_STORAGE_KEY, locale);
    } catch {
      // A manual choice still applies immediately when persistence is unavailable.
    }

    if (locale !== currentLocale) {
      navigateToLocale(locale);
    }
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        type="button"
        aria-label={t("label")}
        disabled={isPending}
        className={cn(
          "group inline-flex items-center justify-center gap-2",
          "cursor-pointer bg-transparent",
          triggerColorClass,
          "focus-visible:outline-none focus-visible:ring-0",
          "disabled:pointer-events-none disabled:opacity-60",
          className,
        )}
      >
        <Globe className="size-5" strokeWidth={1.4} aria-hidden="true" />

        <span className="font-medium leading-none tracking-normal">
          {currentLocale.toUpperCase()}
        </span>

        <ChevronDown
          className={cn(
            "size-4",
            triggerColorClass,
            "transition-transform duration-300",
            "group-data-popup-open:rotate-180",
          )}
          aria-hidden="true"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="center"
          sideOffset={28}
          className="z-99999 isolate"
        >
          <Menu.Popup
            className={cn(
              "relative min-w-32",
              "origin-(--transform-origin)",
              "rounded-md border bg-white p-1",
              "text-foreground shadow-lg",
              "outline-none",

              // Animation
              "transition-[opacity,transform,scale]",
              "duration-200",
              "data-ending-style:scale-95",
              "data-ending-style:opacity-0",
              "data-starting-style:scale-95",
              "data-starting-style:opacity-0",
            )}
          >
            {locales.map((locale) => {
              const active = locale === currentLocale;

              return (
                <Menu.Item
                  key={locale}
                  disabled={isPending || active}
                  onClick={() => changeLanguage(locale)}
                  className={cn(
                    "flex w-full items-center justify-between",
                    "gap-3 rounded-md px-3 py-2",
                    "text-sm font-medium",
                    "cursor-default outline-none",
                    "transition-colors",
                    "data-highlighted:bg-black/10",
                    active ? "text-foreground/80" : "text-foreground",
                    "data-disabled:pointer-events-none",
                    "data-disabled:opacity-80 cursor-pointer",
                  )}
                >
                  <span>{languageLabels(locale)}</span>

                  {active && <Check className="size-4" aria-hidden="true" />}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
