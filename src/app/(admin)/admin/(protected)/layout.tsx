import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminAppSidebar, AdminBreadcrumbNav } from "@/components/admin/layout";
import { AccountSecurity } from "@/components/admin/account";
import { SidebarInset, SidebarProvider } from "@/components/admin/ui/sidebar";
import { getCurrentAdminUser } from "@/server/auth/guard";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentAdminUser();
  if (!user) redirect("/admin/login");

  if (user.mustResetPassword) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-5">
          <div><h1 className="text-2xl font-semibold">Initial password reset required</h1><p className="text-sm text-muted-foreground">Change the temporary password before accessing administration tools.</p></div>
          <AccountSecurity locale={user.preferredLocale === "EN" ? "en" : "fr"} />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminAppSidebar role={user.role} />
      <SidebarInset>
        <AdminBreadcrumbNav user={{ name: user.name, email: user.email }} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
