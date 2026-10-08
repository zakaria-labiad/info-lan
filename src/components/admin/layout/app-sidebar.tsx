"use client";

import Image from "next/image";
import Link from "next/link";

import { AdminNavMain } from "@/components/admin/layout/nav-main";
import { adminNavigation } from "@/components/admin/layout/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/admin/ui/sidebar";

export function AdminAppSidebar({ role }: { role: "ADMIN" | "EMPLOYEE" }) {
  const items = adminNavigation.filter((item) => !item.adminOnly || role === "ADMIN");

  return (
    <Sidebar variant="inset" className="p-0">
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton size="lg" className="h-auto p-0 hover:bg-transparent active:bg-transparent" asChild>
              <Link href="/admin/dashboard">
                <div className="flex w-full items-center justify-center px-2 py-3 group-data-[collapsible=icon]:px-0">
                  <Image
                    src="/images/info-lan-logo.webp"
                    alt="INFO-L@N"
                    width={1080}
                    height={430}
                    className="h-12 w-auto max-w-34 object-contain transition-all group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:max-w-8"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={items} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
