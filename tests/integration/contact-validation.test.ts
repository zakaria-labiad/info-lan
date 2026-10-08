import assert from "node:assert/strict";
import test from "node:test";

import { contactInputSchema } from "../../src/server/contact/validation";

test("contact input trims fields and normalizes the sender email", () => {
  assert.deepEqual(
    contactInputSchema.parse({
      name: "  Client Name ",
      email: " CLIENT@Example.COM ",
      subject: "  Project request ",
      message: "  Please contact us about this project. ",
      locale: "en",
      website: "",
    }),
    {
      name: "Client Name",
      email: "client@example.com",
      subject: "Project request",
      message: "Please contact us about this project.",
      locale: "EN",
      website: "",
    },
  );
});

test("contact input rejects honeypot submissions and oversized content", () => {
  assert.equal(
    contactInputSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      subject: "Spam",
      message: "A valid-looking message body",
      locale: "fr",
      website: "https://spam.example",
    }).success,
    false,
  );
});
