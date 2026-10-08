const PLACEHOLDER_HOSTS = ["dicebear.com", "ui-avatars.com"];

export function isPlaceholderImage(src?: string | null): boolean {
  if (!src) return false;
  const normalized = src.toLowerCase();
  return PLACEHOLDER_HOSTS.some((host) => normalized.includes(host));
}

export function resolveImageSrc(src?: string | null): string | undefined {
  const trimmed = src?.trim();
  if (!trimmed || isPlaceholderImage(trimmed)) return undefined;
  return trimmed;
}

export function getInitials(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";

  return (
    trimmed
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || trimmed[0]!.toUpperCase()
  );
}
