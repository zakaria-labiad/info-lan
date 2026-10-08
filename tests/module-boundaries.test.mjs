import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";
import ts from "typescript";

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, "src");

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (absolutePath === join(sourceRoot, "generated")) return [];
      return collectSourceFiles(absolutePath);
    }

    if (!entry.isFile() || !/\.tsx?$/.test(entry.name) || entry.name.endsWith(".d.ts")) {
      return [];
    }

    return [absolutePath];
  });
}

function relativeModuleSpecifiers(file) {
  const source = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const violations = [];

  function record(node, kind) {
    if (!node || !ts.isStringLiteralLike(node)) return;
    if (!node.text.startsWith("./") && !node.text.startsWith("../")) return;

    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({
      kind,
      line: position.line + 1,
      specifier: node.text,
    });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      record(node.moduleSpecifier, "import");
    } else if (ts.isExportDeclaration(node)) {
      record(node.moduleSpecifier, "re-export");
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      record(node.arguments[0], "dynamic import");
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function invalidAliasSpecifiers(file) {
  const source = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const violations = [];

  function record(node) {
    if (!node || !ts.isStringLiteralLike(node)) return;
    if (!node.text.startsWith("@/") || !node.text.includes("\\")) return;

    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({ line: position.line + 1, specifier: node.text });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      record(node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      record(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function aliasModuleSpecifiers(file) {
  const source = readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const specifiers = [];

  function record(node) {
    if (node && ts.isStringLiteralLike(node) && node.text.startsWith("@/")) {
      specifiers.push(node.text);
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      record(node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      record(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return specifiers;
}

test("authored source modules use @/ aliases instead of relative specifiers", () => {
  const violations = collectSourceFiles(sourceRoot).flatMap((file) =>
    relativeModuleSpecifiers(file).map((violation) => ({
      file: relative(projectRoot, file).replaceAll("\\", "/"),
      ...violation,
    })),
  );

  assert.deepEqual(
    violations,
    [],
    violations
      .map(
        ({ file, kind, line, specifier }) =>
          `${file}:${line} ${kind} uses ${JSON.stringify(specifier)}`,
      )
      .join("\n"),
  );
});

test("@/ aliases use portable forward slashes", () => {
  const violations = collectSourceFiles(sourceRoot).flatMap((file) =>
    invalidAliasSpecifiers(file).map((violation) => ({
      file: relative(projectRoot, file).replaceAll("\\", "/"),
      ...violation,
    })),
  );

  assert.deepEqual(
    violations,
    [],
    violations
      .map(
        ({ file, line, specifier }) =>
          `${file}:${line} alias uses a Windows separator in ${JSON.stringify(specifier)}`,
      )
      .join("\n"),
  );
});

const publicBoundaryDirectories = [
  "src/animations/client",
  "src/components/admin/shared",
  "src/components/admin/ui",
  "src/components/client/about",
  "src/components/client/about/sections",
  "src/components/client/blog",
  "src/components/client/categories",
  "src/components/client/shared",
  "src/components/client/domains",
  "src/components/client/home",
  "src/components/client/home/sections",
  "src/components/client/home/shared",
  "src/components/client/shared/layout",
  "src/components/client/reviews",
  "src/components/client/seo",
  "src/components/client/ui",
  "src/features/client/types",
  "src/i18n/client",
  "src/i18n/shared",
  "src/lib/client",
  "src/lib/client/routes",
  "src/lib/client/seo",
  "src/lib/shared",
  "src/server/auth",
  "src/server/logger",
  "src/server/repos",
  "src/server/repos/auth",
  "src/server/repos/communication",
  "src/server/repos/content",
  "src/server/repos/shared",
];

test("reusable multi-file modules expose an index.ts public boundary", () => {
  const missing = publicBoundaryDirectories.filter(
    (directory) => !existsSync(join(projectRoot, directory, "index.ts")),
  );

  assert.deepEqual(missing, []);
});

test("public barrels enumerate named exports instead of wildcard exports", () => {
  const wildcardBarrels = publicBoundaryDirectories.filter((directory) => {
    const file = join(projectRoot, directory, "index.ts");
    if (!existsSync(file)) return false;

    const source = readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    return sourceFile.statements.some(
      (statement) =>
        ts.isExportDeclaration(statement) &&
        statement.moduleSpecifier &&
        !statement.exportClause,
    );
  });

  assert.deepEqual(wildcardBarrels, []);
});

test("ordinary authored modules use named exports", () => {
  const roots = [
    "src/animations",
    "src/components",
    "src/features",
    "src/i18n",
    "src/lib",
    "src/server",
  ].map((directory) => join(projectRoot, directory));
  const allowedDefaults = new Set([join(projectRoot, "src/i18n/request.ts")]);
  const violations = roots.flatMap(collectSourceFiles).filter((file) => {
    if (allowedDefaults.has(file)) return false;

    const source = readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    return sourceFile.statements.some((statement) => {
      if (ts.isExportAssignment(statement) && !statement.isExportEquals) return true;
      return Boolean(
        statement.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
        ),
      );
    });
  });

  assert.deepEqual(
    violations.map((file) => relative(projectRoot, file).replaceAll("\\", "/")),
    [],
  );
});

const requiredFrontendBoundaries = [
  "src/app/(admin)/admin/layout.tsx",
  "src/app/(client)/[locale]/layout.tsx",
  "src/components/admin/ui/index.ts",
  "src/components/admin/shared/index.ts",
  "src/components/client/ui/index.ts",
  "src/components/client/shared/index.ts",
  "src/components/client/seo/index.ts",
  "src/animations/client/index.ts",
  "src/features/client/types/index.ts",
  "src/lib/client/index.ts",
  "src/lib/shared/index.ts",
  "src/lib/shared/site.ts",
  "src/i18n/admin/messages.ts",
  "src/i18n/client/index.ts",
  "src/i18n/shared/index.ts",
];

const obsoleteFrontendBoundaries = [
  "src/app/admin",
  "src/app/[locale]",
  "src/components/ui",
  "src/components/shared",
  "src/components/client/common",
  "src/components/client/layout",
  "src/components/seo",
  "src/components/admin/button.tsx",
  "src/animations/index.ts",
  "src/animations/drawer-panel.ts",
  "src/animations/header.ts",
  "src/animations/hero-entrance.ts",
  "src/animations/marquee-loop.ts",
  "src/animations/motion.ts",
  "src/animations/rail-slide.ts",
  "src/animations/scroll-reveal.ts",
  "src/features/types",
  "src/lib/blog.ts",
  "src/lib/constants.ts",
  "src/lib/routes",
  "src/lib/seo",
  "src/lib/utils.ts",
  "src/i18n/config.ts",
  "src/i18n/navigation.ts",
];

test("frontend modules live behind explicit admin, client, or shared boundaries", () => {
  const missing = requiredFrontendBoundaries.filter(
    (path) => !existsSync(join(projectRoot, path)),
  );
  const obsolete = obsoleteFrontendBoundaries.filter((path) =>
    existsSync(join(projectRoot, path)),
  );

  assert.deepEqual({ missing, obsolete }, { missing: [], obsolete: [] });
});

test("admin and client frontend modules never import across surfaces", () => {
  const surfacePrefixes = {
    admin: ["@/components/admin", "@/i18n/admin"],
    client: [
      "@/animations/client",
      "@/components/client",
      "@/features/client",
      "@/i18n/client",
      "@/lib/client",
    ],
  };
  const belongsToSurface = (specifier, surface) =>
    surfacePrefixes[surface].some(
      (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
    );
  const ownershipRoots = [
    {
      owner: "admin",
      roots: ["src/app/(admin)", "src/components/admin", "src/i18n/admin"],
      forbiddenSurfaces: ["client"],
    },
    {
      owner: "client",
      roots: [
        "src/app/(client)",
        "src/components/client",
        "src/animations/client",
        "src/features/client",
        "src/lib/client",
        "src/i18n/client",
      ],
      forbiddenSurfaces: ["admin"],
    },
    {
      owner: "shared",
      roots: ["src/app/layout.tsx", "src/lib/shared", "src/i18n/shared"],
      forbiddenSurfaces: ["admin", "client"],
    },
  ];
  const violations = ownershipRoots.flatMap(
    ({ owner, roots, forbiddenSurfaces }) =>
      roots.flatMap((root) => {
        const absoluteRoot = join(projectRoot, root);
        if (!existsSync(absoluteRoot)) return [];
        const files = /\.tsx?$/.test(root)
          ? [absoluteRoot]
          : collectSourceFiles(absoluteRoot);

        return files.flatMap((file) =>
          aliasModuleSpecifiers(file)
            .filter((specifier) =>
              forbiddenSurfaces.some((surface) =>
                belongsToSurface(specifier, surface),
              ),
            )
            .map((specifier) => ({
              owner,
              file: relative(projectRoot, file).replaceAll("\\", "/"),
              specifier,
            })),
        );
      }),
  );

  assert.deepEqual(violations, []);
});
