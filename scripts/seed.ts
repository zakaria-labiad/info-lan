import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { CATEGORY_ROUTES } from "../src/lib/client/routes/catalog";
import frBlog from "../src/messages/fr/client/pages/resources/blog.json";
import enBlog from "../src/messages/en/client/pages/resources/blog.json";
import frCatalog from "../src/messages/fr/client/pages/category-detail.json";
import enCatalog from "../src/messages/en/client/pages/category-detail.json";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");
const adapter = databaseUrl.startsWith("file:")
  ? new PrismaBetterSqlite3({ url: databaseUrl })
  : databaseUrl.startsWith("postgresql:") || databaseUrl.startsWith("postgres:")
    ? new PrismaPg({ connectionString: databaseUrl })
    : null;
if (!adapter) throw new Error("DATABASE_URL must use file:, postgres:, or postgresql:.");
const prisma = new PrismaClient({ adapter });

type StaticPost = (typeof frBlog.posts)[number];

function richText(post: StaticPost) {
  const content = post.body.flatMap((section) => [
    ...(section.heading ? [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: section.heading }] }] : []),
    ...section.paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
    ...(("closingParagraphs" in section && section.closingParagraphs) ? section.closingParagraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })) : []),
  ]);
  return { type: "doc", content };
}

async function bootstrapAdministrator() {
  const count = await prisma.user.count();
  if (count > 0) return (await prisma.user.findFirst({ where: { role: "ADMIN", isActive: true, deletedAt: null }, orderBy: { id: "asc" } })) ?? (await prisma.user.findFirstOrThrow({ orderBy: { id: "asc" } }));
  const name = process.env.BOOTSTRAP_ADMIN_NAME; const email = process.env.BOOTSTRAP_ADMIN_EMAIL; const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!name || !email || !password) throw new Error("The first user requires BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD.");
  return prisma.user.create({ data: { name, email: email.toLowerCase(), passcodeHash: await bcrypt.hash(password, 12), role: "ADMIN", mustResetPassword: true } });
}

async function importBlog(userId: number) {
  const enBySlug = new Map(enBlog.posts.map((post) => [post.slug, post]));
  const enCategories = new Map(enBlog.categories.map((item) => [item.slug, item.label]));
  for (const [index, category] of frBlog.categories.filter((item) => item.slug !== "all").entries()) {
    await prisma.blogCategory.upsert({ where: { slugFr: category.slug }, create: { nameFr: category.label, nameEn: enCategories.get(category.slug) ?? category.label, slugFr: category.slug, slugEn: category.slug, sortOrder: index }, update: { nameFr: category.label, nameEn: enCategories.get(category.slug) ?? category.label, sortOrder: index, deletedAt: null } });
  }
  for (const fr of frBlog.posts) {
    const en = enBySlug.get(fr.slug); if (!en) continue;
    let post = await prisma.blogPost.findFirst({ where: { translations: { some: { locale: "FR", slug: fr.slug } } } });
    if (!post) post = await prisma.blogPost.create({ data: { status: "PUBLISHED", publishedAt: new Date(), createdById: userId, updatedById: userId } });
    for (const [locale, source] of [["FR", fr], ["EN", en]] as const) await prisma.blogPostTranslation.upsert({ where: { postId_locale: { postId: post.id, locale } }, create: { postId: post.id, locale, slug: source.slug, title: source.title, excerpt: source.excerpt, content: richText(source as StaticPost), seoTitle: source.title, seoDescription: source.excerpt, isReady: true }, update: { slug: source.slug, title: source.title, excerpt: source.excerpt, content: richText(source as StaticPost), seoTitle: source.title, seoDescription: source.excerpt, isReady: true } });
    const category = await prisma.blogCategory.findUnique({ where: { slugFr: fr.category } });
    if (category) await prisma.blogPostCategory.upsert({ where: { postId_categoryId: { postId: post.id, categoryId: category.id } }, create: { postId: post.id, categoryId: category.id }, update: {} });
  }
}

async function importCatalog(userId: number) {
  const categoryIds = new Map<string, number>();
  let categoryOrder = 0;
  for (const [slug, config] of Object.entries(CATEGORY_ROUTES)) {
    const category = await prisma.productCategory.upsert({ where: { slugFr: slug }, create: { nameFr: frCatalog.categories[config.messageKey as keyof typeof frCatalog.categories], nameEn: enCatalog.categories[config.messageKey as keyof typeof enCatalog.categories], slugFr: slug, slugEn: slug, sortOrder: categoryOrder++ }, update: { nameFr: frCatalog.categories[config.messageKey as keyof typeof frCatalog.categories], nameEn: enCatalog.categories[config.messageKey as keyof typeof enCatalog.categories], deletedAt: null } });
    categoryIds.set(slug, category.id);
  }
  const products = new Map<string, string>();
  for (const config of Object.values(CATEGORY_ROUTES)) for (const item of config.products) products.set(item.id, item.family);
  let productOrder = 0;
  for (const [slug, family] of products) {
    let product = await prisma.product.findFirst({ where: { translations: { some: { locale: "FR", slug } } } });
    if (!product) product = await prisma.product.create({ data: { status: "PUBLISHED", family, availability: "active", sortOrder: productOrder++, publishedAt: new Date(), createdById: userId, updatedById: userId } });
    const frTitle = frCatalog.products[slug as keyof typeof frCatalog.products]; const enTitle = enCatalog.products[slug as keyof typeof enCatalog.products];
    for (const [locale, title, categoryLabel] of [["FR", frTitle, "industriels"], ["EN", enTitle, "industrial projects"]] as const) await prisma.productTranslation.upsert({ where: { productId_locale: { productId: product.id, locale } }, create: { productId: product.id, locale, slug, title, shortDescription: locale === "FR" ? `${title} conçu pour les projets ${categoryLabel}.` : `${title} designed for ${categoryLabel}.`, description: locale === "FR" ? `${title} est fabriqué selon les dimensions, matières, finitions et contraintes de votre site.` : `${title} is manufactured to suit your site dimensions, materials, finishes, and constraints.`, isReady: true }, update: { slug, title, isReady: true } });
    for (const [categorySlug, config] of Object.entries(CATEGORY_ROUTES)) { const index = config.products.findIndex((item) => item.id === slug); const categoryId = categoryIds.get(categorySlug); if (index >= 0 && categoryId) await prisma.productCategoryAssignment.upsert({ where: { productId_categoryId: { productId: product.id, categoryId } }, create: { productId: product.id, categoryId, sortOrder: index }, update: { sortOrder: index } }); }
  }
}

async function main() {
  const admin = await bootstrapAdministrator();
  await prisma.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, companyName: "INFO-L@N", contactEmail: process.env.EMAIL_FROM_ADDRESS ?? null, publicSiteUrl: process.env.PUBLIC_SITE_URL ?? null, emailFromName: process.env.EMAIL_FROM_NAME ?? "INFO-L@N", emailFromAddress: process.env.EMAIL_FROM_ADDRESS ?? null }, update: {} });
  await importBlog(admin.id);
  await importCatalog(admin.id);
}

main().finally(() => prisma.$disconnect());
