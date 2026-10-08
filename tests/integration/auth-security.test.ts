import assert from "node:assert/strict";
import test from "node:test";

import {
  isTrustedMutationOrigin,
  loginInputSchema,
  resetPasswordInputSchema,
} from "../../src/server/auth/validation";

test("login input normalizes email addresses without changing passwords", () => {
  assert.deepEqual(
    loginInputSchema.parse({ email: "  ADMIN@Example.COM ", password: "  secret value  " }),
    { email: "admin@example.com", password: "  secret value  ", rememberMe: false },
  );
});

test("password reset rejects weak replacement passwords", () => {
  assert.equal(
    resetPasswordInputSchema.safeParse({ token: "valid-token", password: "short" }).success,
    false,
  );
  assert.equal(
    resetPasswordInputSchema.safeParse({
      token: "valid-token",
      password: "LongEnough123!",
    }).success,
    true,
  );
});

test("mutation origin validation accepts same-origin requests and rejects mismatches", () => {
  assert.equal(
    isTrustedMutationOrigin("https://admin.chelbab.ma", "admin.chelbab.ma"),
    true,
  );
  assert.equal(
    isTrustedMutationOrigin("https://attacker.example", "admin.chelbab.ma"),
    false,
  );
  assert.equal(isTrustedMutationOrigin(null, "admin.chelbab.ma"), false);
});
