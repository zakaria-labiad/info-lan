import assert from "node:assert/strict";
import test from "node:test";

import {
  canTransitionMessageStatus,
  messageListQuerySchema,
  messageMutationSchema,
} from "../../src/server/messages/validation";
import { reduceEmailStatus } from "../../src/server/email/status";

test("message list query normalizes filters and bounds pagination", () => {
  assert.deepEqual(
    messageListQuerySchema.parse({ page: "2", perPage: "25", status: "READ", search: "  client  " }),
    { page: 2, perPage: 25, status: "READ", search: "client", assignedTo: undefined },
  );

  assert.equal(messageListQuerySchema.safeParse({ page: "0" }).success, false);
  assert.equal(messageListQuerySchema.safeParse({ perPage: "101" }).success, false);
  assert.equal(messageListQuerySchema.safeParse({ status: "DELETED" }).success, false);
});

test("message mutations reject empty notes and malformed assignees", () => {
  assert.equal(messageMutationSchema.safeParse({ action: "note", body: "   " }).success, false);
  assert.equal(messageMutationSchema.safeParse({ action: "assign", assignedToId: -1 }).success, false);
  assert.deepEqual(messageMutationSchema.parse({ action: "archive", revision: 3 }), {
    action: "archive",
    revision: 3,
  });
});

test("message status transitions preserve archive as a terminal workflow state", () => {
  assert.equal(canTransitionMessageStatus("NEW", "READ"), true);
  assert.equal(canTransitionMessageStatus("READ", "REPLIED"), true);
  assert.equal(canTransitionMessageStatus("REPLIED", "ARCHIVED"), true);
  assert.equal(canTransitionMessageStatus("ARCHIVED", "READ"), false);
  assert.equal(canTransitionMessageStatus("NEW", "REPLIED"), false);
});

test("email delivery events move forward and ignore stale regressions", () => {
  assert.equal(reduceEmailStatus("PENDING", "email.sent"), "SENT");
  assert.equal(reduceEmailStatus("SENT", "email.delivered"), "DELIVERED");
  assert.equal(reduceEmailStatus("DELIVERED", "email.sent"), "DELIVERED");
  assert.equal(reduceEmailStatus("FAILED", "email.delivered"), "DELIVERED");
  assert.equal(reduceEmailStatus("DELIVERED", "email.bounced"), "BOUNCED");
});
