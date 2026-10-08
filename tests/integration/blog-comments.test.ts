import assert from "node:assert/strict";
import test from "node:test";

import { commentModerationSchema, publicCommentInputSchema } from "../../src/server/blog/comments";

test("public blog comments require identity and content while accepting the honeypot", () => {
  const valid = publicCommentInputSchema.safeParse({
    fullName: "Client Name",
    email: "client@example.com",
    subject: "Useful article",
    message: "Thank you for this detailed guide.",
    locale: "FR",
    website: "",
  });
  assert.equal(valid.success, true);
  assert.equal(publicCommentInputSchema.safeParse({ ...valid.data, message: "x" }).success, false);
  assert.equal(publicCommentInputSchema.safeParse({ ...valid.data, email: "not-an-email" }).success, false);
});

test("comment moderation only accepts supported flat-comment states", () => {
  assert.equal(commentModerationSchema.safeParse({ status: "APPROVED" }).success, true);
  assert.equal(commentModerationSchema.safeParse({ status: "SPAM" }).success, true);
  assert.equal(commentModerationSchema.safeParse({ status: "REPLIED" }).success, false);
});
