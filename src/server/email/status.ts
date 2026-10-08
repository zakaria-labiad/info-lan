const ranks = {
  PENDING: 0,
  SENT: 1,
  FAILED: 1,
  DELIVERED: 2,
  BOUNCED: 3,
} as const;

export type EmailLogStatus = keyof typeof ranks;

const eventStatus = {
  "email.sent": "SENT",
  "email.delivered": "DELIVERED",
  "email.failed": "FAILED",
  "email.bounced": "BOUNCED",
  "email.complained": "BOUNCED",
  "email.suppressed": "FAILED",
} as const satisfies Record<string, EmailLogStatus>;

export function reduceEmailStatus(current: EmailLogStatus, event: string): EmailLogStatus {
  const next = eventStatus[event as keyof typeof eventStatus];
  if (!next) return current;
  if (current === "FAILED" && next === "DELIVERED") return "DELIVERED";
  return ranks[next] >= ranks[current] ? next : current;
}
