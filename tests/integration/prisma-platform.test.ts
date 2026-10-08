import assert from "node:assert/strict";
import test from "node:test";

import {
  comparePrismaSchemas,
  resolveDatabaseTarget,
} from "../../scripts/prisma-platform";

test("SQLite URLs select the local schema and migrations", () => {
  assert.deepEqual(resolveDatabaseTarget("file:./prisma/database/test.db", "test"), {
    provider: "sqlite",
    schemaPath: "prisma/schema.sqlite.prisma",
    migrationsPath: "prisma/migrations/sqlite",
    url: "file:./prisma/database/test.db",
  });
});

test("PostgreSQL URLs select the production schema and migrations", () => {
  assert.deepEqual(
    resolveDatabaseTarget("postgresql://app:secret@db.example.com/chelbab", "production"),
    {
      provider: "postgresql",
      schemaPath: "prisma/schema.postgresql.prisma",
      migrationsPath: "prisma/migrations/postgresql",
      url: "postgresql://app:secret@db.example.com/chelbab",
    },
  );
});

test("production configuration fails closed without a database URL", () => {
  assert.throws(
    () => resolveDatabaseTarget(undefined, "production"),
    /DATABASE_URL is required in production/,
  );
});

test("unsupported database protocols are rejected", () => {
  assert.throws(
    () => resolveDatabaseTarget("mysql://localhost/chelbab", "development"),
    /Unsupported DATABASE_URL protocol/,
  );
});

test("development defaults to an isolated SQLite database", () => {
  assert.deepEqual(resolveDatabaseTarget(undefined, "development"), {
    provider: "sqlite",
    schemaPath: "prisma/schema.sqlite.prisma",
    migrationsPath: "prisma/migrations/sqlite",
    url: "file:./prisma/database/chelbab.db",
  });
});

test("SQLite and PostgreSQL schemas expose the same application contract", async () => {
  const differences = await comparePrismaSchemas(
    "prisma/schema.sqlite.prisma",
    "prisma/schema.postgresql.prisma",
  );

  assert.deepEqual(differences, []);
});
