export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  const firstInitial = parts[0]?.[0] ?? "";
  const lastInitial = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
