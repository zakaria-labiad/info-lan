import { Badge } from "@/components/admin/ui/badge";

const labels = {
  NEW: { fr: "Nouveau", en: "New" },
  READ: { fr: "Lu", en: "Read" },
  REPLIED: { fr: "Répondu", en: "Replied" },
  ARCHIVED: { fr: "Archivé", en: "Archived" },
} as const;

export function MessageStatusBadge({
  status,
  locale,
}: {
  status: keyof typeof labels;
  locale: "fr" | "en";
}) {
  const variant = status === "NEW" ? "default" : status === "REPLIED" ? "success" : "secondary";
  return <Badge variant={variant}>{labels[status][locale]}</Badge>;
}
