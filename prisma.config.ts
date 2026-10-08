import { config } from "dotenv";
import { defineConfig } from "prisma/config";

import { resolveDatabaseTarget } from "./scripts/prisma-platform";

config({ path: ".env" });
config({ path: ".env.local" });

const database = resolveDatabaseTarget(process.env.DATABASE_URL, process.env.NODE_ENV);

export default defineConfig({
  schema: database.schemaPath,
  migrations: {
    path: database.migrationsPath,
  },
  datasource: {
    url: database.url,
  },
});
