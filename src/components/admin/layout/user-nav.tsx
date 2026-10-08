"use client";

import { BadgeCheck, Languages, LogOut } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar";
import { Button } from "@/components/admin/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { getInitials } from "@/lib/admin/utils/image";

type UserNavProps = { name: string; email: string };

export function AdminUserNav({ name, email }: UserNavProps) {
  const locale = useLocale() === "en" ? "en" : "fr";
  const router = useRouter();

  async function changeLanguage(nextLocale: "fr" | "en") {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
    });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full" aria-label={locale === "fr" ? "Menu du compte" : "Account menu"}>
          <Avatar className="size-8">
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin/account" className="flex items-center gap-2">
              <BadgeCheck className="size-4" />
              {locale === "fr" ? "Mon compte" : "My account"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => changeLanguage(locale === "fr" ? "en" : "fr")}>
            <Languages className="size-4" />
            {locale === "fr" ? "English" : "Français"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} className="text-red-600 focus:text-red-600">
          <LogOut className="size-4" />
          {locale === "fr" ? "Déconnexion" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
