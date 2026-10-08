import { readFile } from "node:fs/promises";

export { resolveDatabaseTarget } from "../src/server/db/platform";

type SchemaBlock = {
  kind: "enum" | "model";
  name: string;
  body: string;
};

function extractApplicationBlocks(schema: string): Map<string, SchemaBlock> {
  const blocks = new Map<string, SchemaBlock>();
  const blockPattern = /\b(enum|model)\s+([A-Za-z][A-Za-z0-9_]*)\s*\{([\s\S]*?)\n\}/g;

  for (const match of schema.matchAll(blockPattern)) {
    const [, kind, name, body] = match;
    const normalizedBody = body
      .split("\n")
      .map((line) => line.replace(/\/\/.*$/, "").trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .join("\n");
    const key = `${kind}:${name}`;

    blocks.set(key, {
      kind: kind as SchemaBlock["kind"],
      name,
      body: normalizedBody,
    });
  }

  return blocks;
}

export async function comparePrismaSchemas(
  leftPath: string,
  rightPath: string,
): Promise<string[]> {
  const [leftSource, rightSource] = await Promise.all([
    readFile(leftPath, "utf8"),
    readFile(rightPath, "utf8"),
  ]);
  const left = extractApplicationBlocks(leftSource);
  const right = extractApplicationBlocks(rightSource);
  const keys = [...new Set([...left.keys(), ...right.keys()])].sort();
  const differences: string[] = [];

  for (const key of keys) {
    const leftBlock = left.get(key);
    const rightBlock = right.get(key);

    if (!leftBlock) {
      differences.push(`${key} is missing from ${leftPath}`);
    } else if (!rightBlock) {
      differences.push(`${key} is missing from ${rightPath}`);
    } else if (leftBlock.body !== rightBlock.body) {
      differences.push(`${key} differs between database schemas`);
    }
  }

  return differences;
}
