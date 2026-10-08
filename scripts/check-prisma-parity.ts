import { comparePrismaSchemas } from "./prisma-platform";

async function main() {
  const differences = await comparePrismaSchemas(
    "prisma/schema.sqlite.prisma",
    "prisma/schema.postgresql.prisma",
  );

  if (differences.length > 0) {
    throw new Error(`Prisma schema parity failed:\n${differences.join("\n")}`);
  }

  process.stdout.write("SQLite and PostgreSQL schemas are structurally equivalent.\n");
}

void main();
