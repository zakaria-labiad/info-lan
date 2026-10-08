export type DatabaseProvider = "sqlite" | "postgresql";

export type DatabaseTarget = {
  provider: DatabaseProvider;
  schemaPath: string;
  migrationsPath: string;
  url: string;
};

const SQLITE_DEFAULT_URL = "file:./prisma/database/chelbab.db";

export function resolveDatabaseTarget(
  databaseUrl: string | undefined,
  nodeEnv = process.env.NODE_ENV ?? "development",
): DatabaseTarget {
  const url = databaseUrl?.trim();

  if (!url) {
    if (nodeEnv === "production") {
      throw new Error("DATABASE_URL is required in production");
    }

    return {
      provider: "sqlite",
      schemaPath: "prisma/schema.sqlite.prisma",
      migrationsPath: "prisma/migrations/sqlite",
      url: SQLITE_DEFAULT_URL,
    };
  }

  if (url.startsWith("file:")) {
    return {
      provider: "sqlite",
      schemaPath: "prisma/schema.sqlite.prisma",
      migrationsPath: "prisma/migrations/sqlite",
      url,
    };
  }

  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return {
      provider: "postgresql",
      schemaPath: "prisma/schema.postgresql.prisma",
      migrationsPath: "prisma/migrations/postgresql",
      url,
    };
  }

  throw new Error(
    "Unsupported DATABASE_URL protocol. Use file: for SQLite or postgresql:// for PostgreSQL.",
  );
}
