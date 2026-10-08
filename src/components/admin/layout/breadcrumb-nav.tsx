"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { AdminUserNav } from "@/components/admin/layout/user-nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/admin/ui/breadcrumb";
import { Separator } from "@/components/admin/ui/separator";
import { SidebarTrigger } from "@/components/admin/ui/sidebar";

const labels: Record<string, { fr: string; en: string }> = {
  admin: { fr: "Administration", en: "Administration" },
  dashboard: { fr: "Tableau de bord", en: "Dashboard" },
  messages: { fr: "Messages", en: "Messages" },
  blog: { fr: "Blog", en: "Blog" },
  new: { fr: "Nouveau", en: "New" },
  edit: { fr: "Modifier", en: "Edit" },
  categories: { fr: "Catégories", en: "Categories" },
  tags: { fr: "Étiquettes", en: "Tags" },
  comments: { fr: "Commentaires", en: "Comments" },
  products: { fr: "Produits", en: "Products" },
  "product-categories": { fr: "Catégories produits", en: "Product categories" },
  media: { fr: "Médias", en: "Media" },
  users: { fr: "Utilisateurs", en: "Users" },
  audit: { fr: "Journal d’audit", en: "Audit log" },
  settings: { fr: "Paramètres", en: "Settings" },
  account: { fr: "Compte", en: "Account" },
};

export function AdminBreadcrumbNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const locale = useLocale() === "en" ? "en" : "fr";
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex shrink-0 border-b bg-background">
      <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const title = labels[segment]?.[locale] ?? (/^\d+$/.test(segment) ? `#${segment}` : segment);
                return (
                  <div key={href} className="flex items-center">
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : undefined}>
                      {isLast ? <BreadcrumbPage>{title}</BreadcrumbPage> : (
                        <BreadcrumbLink asChild><Link href={href}>{title}</Link></BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : undefined} /> : null}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <AdminUserNav name={user.name} email={user.email} />
      </div>
    </header>
  );
}
