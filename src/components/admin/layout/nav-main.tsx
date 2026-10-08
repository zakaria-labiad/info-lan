"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/admin/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/admin/ui/sidebar";
import type { AdminNavigationItem } from "@/components/admin/layout/navigation";

function matchesPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavMain({ items }: { items: AdminNavigationItem[] }) {
  const pathname = usePathname();
  const locale = useLocale() === "en" ? "en" : "fr";

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const title = item.title[locale];
          const hasActiveChild = item.children?.some((child) => child.href && matchesPath(pathname, child.href));
          return (
            <Collapsible key={item.id} asChild defaultOpen={hasActiveChild} className="group/collapsible">
              <SidebarMenuItem>
                {item.children ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={title}>
                        <item.icon />
                        <span>{title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton asChild isActive={Boolean(child.href && matchesPath(pathname, child.href))}>
                              <Link href={child.href!}>
                                <child.icon />
                                <span>{child.title[locale]}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild isActive={Boolean(item.href && matchesPath(pathname, item.href))} tooltip={title}>
                    <Link href={item.href!}>
                      <item.icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
