import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "@/server/auth/guard";

export default async function AdminPage() {
  redirect((await getCurrentAdminUser()) ? "/admin/dashboard" : "/admin/login");
}
