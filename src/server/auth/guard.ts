import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAccessToken } from "@/server/auth/tokens";
import { ACCESS_COOKIE } from "@/server/auth/cookies";
import { prisma } from "@/server/db/prisma";

export async function getCurrentAdminUser() {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const session = await verifyAccessToken(accessToken);
    return prisma.user.findFirst({
      where: { id: session.userId, isActive: true, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        preferredLocale: true,
        mustResetPassword: true,
      },
    });
  } catch {
    return null;
  }
}

export async function requireAdminPageUser(requiredRole?: "ADMIN") {
  const user = await getCurrentAdminUser();
  if (!user) redirect("/admin/login");
  if (user.mustResetPassword) redirect("/admin/account");
  if (requiredRole && user.role !== requiredRole) redirect("/admin/dashboard");
  return user;
}
