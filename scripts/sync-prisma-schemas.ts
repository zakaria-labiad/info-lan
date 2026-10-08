import { readFile, writeFile } from "node:fs/promises";

const applicationSchemaPath = "prisma/schema.application.prisma";
const generator = `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
`;

function schemaHeader(provider: "sqlite" | "postgresql") {
  return `${generator}
datasource db {
  provider = "${provider}"
}

`;
}

async function main() {
  const applicationSchema = await readFile(applicationSchemaPath, "utf8");

  await Promise.all([
    writeFile(
      "prisma/schema.sqlite.prisma",
      `${schemaHeader("sqlite")}${applicationSchema}`,
    ),
    writeFile(
      "prisma/schema.postgresql.prisma",
      `${schemaHeader("postgresql")}${applicationSchema}`,
    ),
  ]);
}

void main();
