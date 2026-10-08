export {
  BLOG_PAGE_SIZE,
  buildBlogHref,
  getBlogCategory,
  getBlogPostBySlug,
  getFilteredBlogPosts,
  getPaginatedBlogPosts,
  hydrateBlogPosts,
} from "@/lib/client/blog";
export {
  CATEGORY_ROUTES,
  DOMAIN_ROUTES,
  PUBLIC_STATIC_PATHS,
  categorySlugs,
  domainSlugs,
  getCatalogCategory,
  getDomainRoute,
  getProductCategory,
  hasCatalogProduct,
} from "@/lib/client/routes";
export type {
  CatalogCategoryRoute,
  CatalogProductRoute,
  DomainRoute,
} from "@/lib/client/routes";
export {
  buildPageMetadata,
  buildTranslatedPageMetadata,
  createTranslatedMetadata,
  getLocalizedPath,
  getLocalizedUrl,
} from "@/lib/client/seo";
