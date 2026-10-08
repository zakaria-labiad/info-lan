import type { UserRole } from "@/generated/prisma/enums";

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}

export function isEmployee(role: UserRole): boolean {
  return role === "EMPLOYEE";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canManageContent(role: UserRole): boolean {
  return role === "ADMIN" || role === "EMPLOYEE";
}

export function canManageProducts(role: UserRole): boolean {
  return role === "ADMIN" || role === "EMPLOYEE";
}

export function canManageBlogPosts(role: UserRole): boolean {
  return role === "ADMIN" || role === "EMPLOYEE";
}

export function canManageMessages(role: UserRole): boolean {
  return role === "ADMIN" || role === "EMPLOYEE";
}

export function canSendEmails(role: UserRole): boolean {
  return role === "ADMIN" || role === "EMPLOYEE";
}
