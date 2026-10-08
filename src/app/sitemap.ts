import type { MetadataRoute } from "next";

import { locales, type Locale } from "@/i18n/shared/config";
import {
  CATEGORY_ROUTES,
  domainSlugs,
  PUBLIC_STATIC_PATHS,
} from "@/lib/client/routes";
import { getLocalizedUrl } from "@/lib/client/seo";
import staticBlogMessages from "@/messages/fr/client/pages/resources/blog.json";
import { prisma } from "@/server/db/prisma";

function getLanguageAlternates(pathname: string) {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedUrl(locale, pathname)]),
  );
}

function createEntry(locale: Locale, pathname: string): MetadataRoute.Sitemap[number] {
  return {
    url: getLocalizedUrl(locale, pathname),
    alternates: {
      languages: getLanguageAlternates(pathname),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryPaths = Object.entries(CATEGORY_ROUTES).flatMap(
    ([category, config]) => [
      `/categories/${category}`,
      ...config.products.map(
        (product) => `/categories/${category}/${product.id}`,
      ),
    ],
  );
  const domainPaths = domainSlugs.map((domain) => `/domains/${domain}`);
  const blogPaths = staticBlogMessages.posts.map(
    (post) => `/resources/blog/${post.slug}`,
  );
  const paths = [
    ...PUBLIC_STATIC_PATHS,
    ...categoryPaths,
    ...domainPaths,
    ...blogPaths,
  ];

  const staticEntries = paths.flatMap((pathname) =>
    locales.map((locale) => createEntry(locale, pathname)),
  );
  const now = new Date();
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ where: { deletedAt: null, OR: [{ status: "PUBLISHED", publishedAt: { lte: now } }, { status: "SCHEDULED", scheduledAt: { lte: now } }] }, include: { translations: { where: { isReady: true } } } }),
    prisma.productCategory.findMany({ where: { deletedAt: null, isActive: true }, include: { products: { where: { product: { status: "PUBLISHED", deletedAt: null } }, include: { product: { include: { translations: { where: { isReady: true } } } } } } } }),
  ]).catch(() => [[], []] as const);
  const databaseEntries: MetadataRoute.Sitemap = [];
  for (const post of posts) {
    const alternates = Object.fromEntries(post.translations.map((translation) => [translation.locale.toLowerCase(), getLocalizedUrl(translation.locale.toLowerCase() as Locale, `/resources/blog/${translation.slug}`)]));
    for (const translation of post.translations) databaseEntries.push({ url: getLocalizedUrl(translation.locale.toLowerCase() as Locale, `/resources/blog/${translation.slug}`), lastModified: post.updatedAt, alternates: { languages: alternates } });
  }
  for (const category of categories) {
    const categoryAlternates = { fr: getLocalizedUrl("fr", `/categories/${category.slugFr}`), en: getLocalizedUrl("en", `/categories/${category.slugEn}`) };
    databaseEntries.push({ url: categoryAlternates.fr, lastModified: category.updatedAt, alternates: { languages: categoryAlternates } }, { url: categoryAlternates.en, lastModified: category.updatedAt, alternates: { languages: categoryAlternates } });
    for (const assignment of category.products) {
      const translations = assignment.product.translations;
      const productAlternates = Object.fromEntries(translations.map((translation) => { const language = translation.locale.toLowerCase() as Locale; const categorySlug = language === "fr" ? category.slugFr : category.slugEn; return [language, getLocalizedUrl(language, `/categories/${categorySlug}/${translation.slug}`)]; }));
      for (const translation of translations) { const language = translation.locale.toLowerCase() as Locale; const categorySlug = language === "fr" ? category.slugFr : category.slugEn; databaseEntries.push({ url: getLocalizedUrl(language, `/categories/${categorySlug}/${translation.slug}`), lastModified: assignment.product.updatedAt, alternates: { languages: productAlternates } }); }
    }
  }
  return [...new Map([...staticEntries, ...databaseEntries].map((entry) => [entry.url, entry])).values()];
}
