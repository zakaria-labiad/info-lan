import { z } from "zod";

const messageStatusSchema = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export const messageListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(20),
    status: messageStatusSchema.optional(),
    search: z.string().trim().max(120).optional(),
    assignedTo: z.coerce.number().int().positive().optional(),
  })
  .transform((value) => ({
    ...value,
    search: value.search || undefined,
    assignedTo: value.assignedTo,
  }));

export const messageMutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("mark-read"),
    revision: z.number().int().positive(),
  }),
  z.object({
    action: z.literal("archive"),
    revision: z.number().int().positive(),
  }),
  z.object({
    action: z.literal("assign"),
    assignedToId: z.number().int().positive().nullable(),
    revision: z.number().int().positive(),
  }),
  z.object({
    action: z.literal("note"),
    body: z.string().trim().min(1).max(5_000),
  }),
]);

export const messageReplySchema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20_000),
  idempotencyKey: z.string().uuid(),
});

type MessageStatus = z.infer<typeof messageStatusSchema>;

const statusTransitions: Record<MessageStatus, readonly MessageStatus[]> = {
  NEW: ["READ", "ARCHIVED"],
  READ: ["REPLIED", "ARCHIVED"],
  REPLIED: ["ARCHIVED"],
  ARCHIVED: [],
};

export function canTransitionMessageStatus(from: MessageStatus, to: MessageStatus) {
  return statusTransitions[from].includes(to);
}
