import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const { parse } = require("@formatjs/icu-messageformat-parser");
const ts = require("typescript");
const locales = ["en", "fr"];
const messagesRoot = path.resolve("src/messages");

function jsonFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? jsonFiles(fullPath)
      : entry.name.endsWith(".json")
        ? [fullPath]
        : [];
  });
}

function localeTree(locale) {
  const localeRoot = path.join(messagesRoot, locale);
  const tree = new Map();

  for (const file of jsonFiles(localeRoot)) {
    const relativeFile = path.relative(localeRoot, file).replaceAll("\\", "/");
    tree.set(relativeFile, JSON.parse(readFileSync(file, "utf8")));
  }

  return tree;
}

function visit(value, key, shape, strings) {
  if (Array.isArray(value)) {
    shape.set(key, `array:${value.length}`);
    value.forEach((item, index) =>
      visit(item, `${key}[${index}]`, shape, strings),
    );
  } else if (value !== null && typeof value === "object") {
    shape.set(key, "object");
    for (const [name, child] of Object.entries(value)) {
      visit(child, `${key}.${name}`, shape, strings);
    }
  } else {
    shape.set(key, value === null ? "null" : typeof value);
    if (typeof value === "string") strings.set(key, value);
  }
}

function catalog(locale) {
  const files = localeTree(locale);
  const shape = new Map();
  const strings = new Map();

  for (const [file, value] of files) {
    visit(value, file, shape, strings);
  }

  return { files, shape, strings };
}

function messageSignature(message) {
  const signature = new Set();

  function visitNodes(nodes) {
    for (const node of nodes) {
      if (node.type >= 1 && node.type <= 6) {
        signature.add(`arg:${node.value}:${node.type}`);
      }
      if (node.type === 8) {
        signature.add(`tag:${node.value}`);
        visitNodes(node.children);
      }
      if (node.options) {
        for (const option of Object.values(node.options)) {
          visitNodes(option.value);
        }
      }
    }
  }

  visitNodes(parse(message));
  return [...signature].sort();
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(fullPath)
      : /\.(ts|tsx)$/.test(entry.name)
        ? [fullPath]
        : [];
  });
}

function fileForNamespace(namespace) {
  const parts = namespace.split(".");
  if (["common", "shared"].includes(parts[0])) return `${parts[0]}.json`;
  if (parts[0] === "admin") return "admin/navigation.json";
  if (["header", "footer", "sideMenu"].includes(parts[0])) {
    return `client/${parts[0] === "sideMenu" ? "side-menu" : parts[0]}.json`;
  }
  if (parts[0] === "pages") {
    const name = parts[1]?.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    if (parts[1] === "resources") {
      const resource = parts[2]?.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `client/pages/resources/${resource}.json`;
    }
    return `client/pages/${name}.json`;
  }
  throw new Error(`Unknown namespace: ${namespace}`);
}

function resolveMessage(files, namespace, key) {
  const parts = namespace.split(".");
  const file = fileForNamespace(namespace);
  const baseDepth = parts[0] === "pages" ? (parts[1] === "resources" ? 3 : 2) : 1;
  const localPath = [...parts.slice(baseDepth), ...key.split(".")];
  return localPath.reduce((value, segment) => value?.[segment], files.get(file));
}

function translationCalls(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const calls = [];

  function visit(node, bindings) {
    const scope = ts.isBlock(node) || ts.isFunctionLike(node)
      ? new Map(bindings)
      : bindings;

    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const expression = node.initializer && ts.isAwaitExpression(node.initializer)
        ? node.initializer.expression
        : node.initializer;
      if (
        expression &&
        ts.isCallExpression(expression) &&
        ts.isIdentifier(expression.expression) &&
        ["useTranslations", "getTranslations"].includes(expression.expression.text) &&
        expression.arguments.length === 1
      ) {
        const argument = expression.arguments[0];
        if (ts.isStringLiteral(argument)) {
          scope.set(node.name.text, argument.text);
        } else if (ts.isObjectLiteralExpression(argument)) {
          const namespace = argument.properties.find(
            (property) =>
              ts.isPropertyAssignment(property) &&
              property.name.getText(source) === "namespace" &&
              ts.isStringLiteral(property.initializer),
          );
          if (namespace && ts.isPropertyAssignment(namespace) && ts.isStringLiteral(namespace.initializer)) {
            scope.set(node.name.text, namespace.initializer.text);
          }
        }
      }
    }

    const translator = ts.isCallExpression(node) && ts.isIdentifier(node.expression)
      ? { name: node.expression.text, kind: "text" }
      : ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.name.text === "raw"
        ? { name: node.expression.expression.text, kind: "raw" }
        : undefined;

    if (
      translator &&
      scope.has(translator.name) &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const position = source.getLineAndCharacterOfPosition(node.getStart(source));
      calls.push({
        file,
        line: position.line + 1,
        namespace: scope.get(translator.name),
        key: node.arguments[0].text,
        kind: translator.kind,
      });
    }

    ts.forEachChild(node, (child) => visit(child, scope));
  }

  visit(source, new Map());
  return calls;
}

function constantKeys(file, name, propertyName = "key") {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  let keys;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      const initializer = ts.isAsExpression(node.initializer) || ts.isSatisfiesExpression(node.initializer)
        ? node.initializer.expression
        : node.initializer;
      assert.ok(ts.isArrayLiteralExpression(initializer), `${name} is not an array`);
      keys = initializer.elements.map((element) => {
        if (ts.isStringLiteral(element)) return element.text;
        assert.ok(ts.isObjectLiteralExpression(element), `${name} has a non-object item`);
        const key = element.properties.find(
          (property) => ts.isPropertyAssignment(property) && property.name.getText(source) === propertyName,
        );
        assert.ok(key && ts.isStringLiteral(key.initializer), `${name} has a nonliteral key`);
        return key.initializer.text;
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  assert.ok(keys?.length, `${name} was not found in ${file}`);
  return keys;
}

function objectStringProperties(file, name, propertyName) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const values = new Set();
  let found = false;

  function collect(node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(source) === propertyName &&
      ts.isStringLiteral(node.initializer)
    ) {
      values.add(node.initializer.text);
    }
    ts.forEachChild(node, collect);
  }

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      found = true;
      collect(node.initializer);
    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(source);
  assert.ok(found && values.size, `${name}.${propertyName} was not found in ${file}`);
  return [...values];
}

test("data-driven navigation, home, and about keys resolve in both locales", () => {
  const headerFile = path.resolve("src/components/client/shared/layout/header.tsx");
  const homeFile = path.resolve("src/components/client/home/data.ts");
  const aboutFile = path.resolve("src/components/client/about/data.ts");
  const families = [
    [headerFile, "PRODUCTS", "header", "nav.products.items", [""]],
    [headerFile, "DOMAINS", "header", "nav.domains.items", [""]],
    [headerFile, "COMPANY", "header", "nav.company.items", [""]],
    [headerFile, "RESOURCES", "header", "nav.resources.items", [""]],
    [homeFile, "HOME_FEATURES", "pages.home", "intro.features", ["title", "description"]],
    [homeFile, "HOME_SERVICES", "pages.home", "services.items", [""]],
    [homeFile, "HOME_BUILDS", "pages.home", "builds.items", ["title", "alt"]],
    [homeFile, "HOME_STATS", "pages.home", "stats.items", [""]],
    [homeFile, "HOME_PROCESSES", "pages.home", "process.items", ["title", "description"]],
    [homeFile, "HOME_TESTIMONIALS", "pages.home", "testimonials.items", ["name", "company", "quote", "imageAlt"]],
    [homeFile, "HOME_BLOG_POSTS", "pages.home", "blog.items", ["title", "date", "alt"]],
    [homeFile, "HOME_SKILLS", "pages.home", "challenge.skills", [""]],
    [homeFile, "HOME_MARQUEE_ITEMS", "pages.home", "marquee", [""]],
    [aboutFile, "ABOUT_HIGHLIGHTS", "pages.about", "highlights.items", ["title", "description"]],
    [aboutFile, "ABOUT_ACHIEVEMENTS", "pages.about", "achievements.items", [""]],
    [aboutFile, "ABOUT_PROFESSIONALS", "pages.about", "professionals.items", ["alt", "name", "role"]],
    [aboutFile, "ABOUT_MARQUEE_ITEMS", "pages.about", "marquee", [""]],
  ];

  for (const locale of locales) {
    const files = localeTree(locale);
    for (const [file, array, namespace, prefix, suffixes] of families) {
      for (const key of constantKeys(file, array)) {
        for (const suffix of suffixes) {
          const path = [prefix, key, suffix].filter(Boolean).join(".");
          assert.equal(
            typeof resolveMessage(files, namespace, path),
            "string",
            `${locale}: ${namespace}.${path} from ${array}`,
          );
        }
      }
    }
  }
});

test("footer, gallery, quote, category, domain, and related-product dynamic keys resolve", () => {
  const footer = path.resolve("src/components/client/shared/layout/footer.tsx");
  const sideMenu = path.resolve("src/components/client/shared/layout/side-menu.tsx");
  const gallery = path.resolve("src/components/client/gallery/galeries-content.tsx");
  const catalogRoutes = path.resolve("src/lib/client/routes/catalog.ts");
  const domainRoutes = path.resolve("src/lib/client/routes/domains.ts");
  const products = path.resolve("src/app/(client)/[locale]/categories/[category]/[product]/page.tsx");
  const quote = path.resolve("src/app/(client)/[locale]/_quote/page.tsx");
  const families = [
    [footer, "quickLinks", "footer", "quickLinks.items", [""], "key"],
    [footer, "contactLinks", "footer", "social", [""], "key"],
    [sideMenu, "contactLinks", "sideMenu", "contact", [""], "key"],
    [gallery, "CATEGORIES", "pages.resources.galeries", "categories", [""], "key"],
    [gallery, "SOURCE_IMAGES", "pages.resources.galeries", "alts", [""], "altKey"],
    [quote, "services", "pages.quote", "form.services.options", [""], "key"],
    [products, "SIMILAR_PRODUCT_IDS", "pages.productDetail", "similarProducts.items", ["title", "description"], "key"],
  ];

  for (const locale of locales) {
    const files = localeTree(locale);
    for (const [file, array, namespace, prefix, suffixes, property] of families) {
      for (const key of constantKeys(file, array, property)) {
        for (const suffix of suffixes) {
          const localKey = [prefix, key, suffix].filter(Boolean).join(".");
          assert.equal(typeof resolveMessage(files, namespace, localKey), "string", `${locale}: ${namespace}.${localKey}`);
        }
      }
    }

    for (const key of objectStringProperties(catalogRoutes, "CATEGORY_ROUTES", "messageKey")) {
      assert.equal(typeof resolveMessage(files, "pages.categoryDetail", `categories.${key}`), "string", `${locale}: category ${key}`);
    }
    for (const id of objectStringProperties(catalogRoutes, "CATEGORY_ROUTES", "id")) {
      assert.equal(typeof resolveMessage(files, "pages.categoryDetail", `products.${id}`), "string", `${locale}: product ${id}`);
    }
    for (const key of objectStringProperties(domainRoutes, "DOMAIN_ROUTES", "messageKey")) {
      for (const suffix of ["title", "heroDescription"]) {
        assert.equal(typeof resolveMessage(files, "pages.domainDetail", `domains.${key}.${suffix}`), "string", `${locale}: domain ${key}.${suffix}`);
      }
    }
  }
});

test("literal translation calls resolve in every supported locale", () => {
  const calls = sourceFiles(path.resolve("src")).flatMap(translationCalls);
  assert.ok(calls.length > 150, `unexpectedly found only ${calls.length} literal calls`);
  assert.ok(calls.filter((call) => call.kind === "raw").length >= 8, "raw translation calls were not inventoried");

  for (const locale of locales) {
    const files = localeTree(locale);
    for (const call of calls) {
      const value = resolveMessage(files, call.namespace, call.key);
      assert.equal(
        call.kind === "raw" ? Array.isArray(value) : typeof value === "string",
        true,
        `${locale}: ${call.namespace}.${call.key} at ${call.file}:${call.line}`,
      );
    }
  }
});

test("English and French catalogs have matching files and complete nested shapes", () => {
  const english = catalog("en");
  const french = catalog("fr");

  assert.deepEqual([...english.files.keys()].sort(), [...french.files.keys()].sort());
  assert.deepEqual([...english.shape].sort(), [...french.shape].sort());
  assert.equal(
    [...english.strings.values(), ...french.strings.values()].every(
      (value) => value.trim().length > 0,
    ),
    true,
  );
});

test("all messages parse as ICU and use the same arguments and rich tags", () => {
  const english = catalog("en").strings;
  const french = catalog("fr").strings;

  for (const [key, message] of english) {
    assert.deepEqual(
      messageSignature(message),
      messageSignature(french.get(key)),
      `message signature differs at ${key}`,
    );
  }
});

test("shared UI text exists for both locales", () => {
  const required = [
    "errors.unexpected",
    "errors.retry",
    "errors.notFound",
    "errors.notFoundDescription",
    "loading",
    "navigation.previous",
    "navigation.next",
    "navigation.backToTop",
    "media.heroAlt",
    "media.companyOverview",
    "languages.en",
    "languages.fr",
    "metadata.description",
    "metadata.homeTitle",
    "metadata.homeDescription",
    "media.homeHeroAlt",
    "controls.close",
    "controls.breadcrumb",
    "controls.more",
  ];

  for (const locale of locales) {
    const common = localeTree(locale).get("common.json");
    for (const key of required) {
      const value = key.split(".").reduce((current, part) => current?.[part], common);
      assert.equal(typeof value, "string", `${locale}: common.${key}`);
      assert.ok(value.trim(), `${locale}: common.${key} is empty`);
    }
  }
});

test("admin labels and placeholder descriptions exist for both locales", () => {
  const required = [
    "overview.title",
    "overview.description",
    "overview.metadataDescription",
    "login.title",
    "login.description",
    "login.metadataDescription",
    "dashboardPage.description",
    "dashboardPage.metadataDescription",
  ];

  for (const locale of locales) {
    const admin = localeTree(locale).get("admin/navigation.json");
    for (const key of required) {
      const value = key.split(".").reduce((current, part) => current?.[part], admin);
      assert.equal(typeof value, "string", `${locale}: admin.${key}`);
      assert.ok(value.trim(), `${locale}: admin.${key} is empty`);
    }
  }
});

test("partner logo alternatives preserve the partner interpolation", () => {
  for (const locale of locales) {
    const partners = localeTree(locale).get("client/pages/partners.json");
    assert.equal(typeof partners.logoAlt, "string", `${locale}: partners.logoAlt`);
    assert.deepEqual(messageSignature(partners.logoAlt), ["arg:partner:1"]);
  }
});

test("confirmed obsolete message groups are absent", () => {
  for (const locale of locales) {
    const tree = localeTree(locale);
    assert.equal(tree.has("client/pages/domain-category.json"), false);
    assert.equal(tree.has("shared.json"), false);
    const sideMenu = tree.get("client/side-menu.json");
    assert.equal("title" in sideMenu, false);
    assert.equal("links" in sideMenu, false);
    assert.equal("navigationLabel" in sideMenu, false);
    const admin = tree.get("admin/navigation.json");
    for (const key of ["users", "products", "categories", "orders", "messages", "settings"]) {
      assert.equal(key in admin, false, `${locale}: admin.${key} remains unused`);
    }
  }
});
