import { mkdir, open } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl?.startsWith("file:")) throw new Error("prepare-sqlite-db requires a file: DATABASE_URL");
  const relativePath = decodeURIComponent(databaseUrl.slice("file:".length));
  const databasePath = resolve(process.cwd(), relativePath);
  const allowedRoot = resolve(process.cwd(), "prisma", "database");
  const pathFromAllowedRoot = relative(allowedRoot, databasePath);
  if (pathFromAllowedRoot.startsWith("..") || isAbsolute(pathFromAllowedRoot)) throw new Error("SQLite test database must be inside prisma/database");
  await mkdir(dirname(databasePath), { recursive: true });
  const handle = await open(databasePath, "a");
  await handle.close();
  console.log(`Prepared ${databasePath}`);
}

void main();
